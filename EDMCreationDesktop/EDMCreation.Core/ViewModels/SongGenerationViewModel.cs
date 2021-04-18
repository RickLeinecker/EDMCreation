using MvvmCross.ViewModels;
using MvvmCross.Commands;
using MvvmCross.Navigation;
using System.Collections.Generic;
using System.Threading.Tasks;
using EDMCreation.Core.Utilities;
using Melanchall.DryWetMidi.Devices;
using EDMCreation.Core.Services.Interfaces;
using EDMCreation.Core.ViewModels.Dialogs;
using System.Linq;
using System;
using System.IO;
using EDMCreation.Core.Models;

namespace EDMCreation.Core.ViewModels
{
    public class SongGenerationViewModel : MvxViewModel<SessionModel>
    {
        // the session is either created or loaded, then passed to this view model as a parameter
        private SessionModel _session;
        public override void Prepare(SessionModel session)
        {
            _session = session;
            _trainingService.Initialize(_session.Genre);
            base.Prepare();
        }

        private readonly IMvxNavigationService _navigationService;
        private readonly ITrainingService _trainingService;
        private readonly IDialogService _dialogService;

        public string Genre { get { return _session.Genre; } }
        public MvxViewModel CurrentContainer { get { return _session.CurrentContainer; } }
        public int CurrentGen { get { return _session.CurrentGen; } }


        private bool _notOnFirstGen;
        public bool NotOnFirstGen { get { return _notOnFirstGen; } set { SetProperty(ref _notOnFirstGen, value); } }

        private bool _notOnLastGen;
        public bool NotOnLastGen { get { return _notOnLastGen; } set { SetProperty(ref _notOnLastGen, value); } }


        public SongGenerationViewModel(IMvxNavigationService navigationService, ITrainingService trainingService, 
            IDialogService dialogService)
        {
            _navigationService = navigationService;
            _trainingService = trainingService;
            _dialogService = dialogService;

            BackCommand = new MvxAsyncCommand(GoBack);
            PrevGenCommand = new MvxCommand(PreviousGeneration);
            NextGenCommand = new MvxCommand(NextGeneration);
            GenerateCommand = new MvxCommand(Generate);
            OptionsCommand = new MvxCommand(Options);

            PlaybackCurrentTimeWatcher.Instance.Start(); // remember to stop this at some point, and reassign playbacks when the view switches
        }

        public MvxCommand GenerateCommand { get; set; }
        private void Generate()
        {
            PauseAll();

            List<string> selectedSongs = new List<string>();
            foreach (SongViewModel s in _session.CurrentSongPanels)
            {
                if (s.IsSelected)
                {
                    selectedSongs.Add(s.MidiFilePath);
                }
            }
            if (selectedSongs.Count < 1 && _session.TotalGens != 0)
            {
                string message = "Not enough songs selected. Please select at least 1 song.";
                InformationDialogViewModel dialog = new InformationDialogViewModel(message);
                _dialogService.ShowDialog(dialog);

                return;
            }

            if (_session.CurrentGen + 1 != _session.TotalGens)
            {
                string question = "You are on a previous generation. This will overwrite any future generations. Generate?";
                YesNoDialogViewModel dialog = new YesNoDialogViewModel(question);
                bool? result = _dialogService.ShowDialog(dialog);

                if (result.HasValue)
                {
                    if (result.Value) // yes, delete future generations
                    {
                        DestroyFutureGenerations(_session.CurrentGen);
                    }
                    else
                        return;
                }
            }

            GenerateAndShowNext();
        }

        private void GenerateAndShowNext()
        {
            GenerateNext();
            _session.CurrentGen++;
            ShowGeneration(_session.CurrentGen);
        }

        private void GenerateNext()
        {
            // generates the next generation without updating view

            // checks if generating the first set or not
            if (_session.CurrentGen == -1 && _session.TotalGens == 0)
            {
                var songFiles = _trainingService.GenerateFirstSongs(_session.MutationRate);
                var songPanels = GenerateSongPanels(songFiles);

                SongsContainerViewModel container = new SongsContainerViewModel(_session.CurrentGen + 1, songPanels);
                _session.SongsContainers.Add(container);
                _session.TotalGens++;
            }
            else
            {
                List<string> selectedSongs = new List<string>();
                foreach (SongViewModel s in _session.CurrentSongPanels)
                {
                    if (s.IsSelected)
                    {
                        selectedSongs.Add(s.MidiFilePath);
                    }
                }

                var songFiles = _trainingService.GenerateSongs(selectedSongs, _session.CurrentGen, _session.TotalGens, _session.MutationRate); // uses test files for now

                var songPanels = GenerateSongPanels(songFiles);

                SongsContainerViewModel container = new SongsContainerViewModel(_session.CurrentGen + 1, songPanels);
                _session.SongsContainers.Add(container);
                _session.TotalGens++;
            }
            
        }

        private List<SongViewModel> GenerateSongPanels(List<string> songFiles)
        {
            int i = 0;
            List<SongViewModel> songPanels = new List<SongViewModel>();

            foreach (string s in songFiles)
            {
                IMidiPlayer midiPlayer = new MidiPlayer(s);
                SongViewModel songPanel = new SongViewModel(midiPlayer, i);
                songPanels.Add(songPanel);
                i++;
            }

            return songPanels;
        }

        private void PauseAll()
        {
            foreach(SongViewModel song in _session.CurrentSongPanels)
            {
                if (song.IsPlaying)
                    song.Pause();
            }
        }

        private void StopAll()
        {
            foreach(SongViewModel song in _session.CurrentSongPanels)
            {
                if (song.IsPlaying)
                    song.Stop();
            }
        }

        // Datacontext related properties are updated only in this function
        private void ShowGeneration(int gen)
        {
            NotOnFirstGen = true;
            NotOnLastGen = true;

            foreach (SongViewModel s in _session.CurrentSongPanels)
            {
                s.StopWatching();
            }

            _session.CurrentGen = gen;
            _session.CurrentContainer = _session.SongsContainers[gen];
            _session.CurrentSongPanels = _session.SongsContainers[gen].Songs;

            _session.CurrentSongFiles.Clear();

            foreach (SongViewModel s in _session.CurrentSongPanels)
            {
                _session.CurrentSongFiles.Add(s.MidiFilePath);
                s.StartWatching();
            }

            if (_session.CurrentGen == 0)
                NotOnFirstGen = false;
            if (_session.CurrentGen + 1 == _session.TotalGens)
                NotOnLastGen = false;

            RaisePropertyChanged(nameof(CurrentContainer));
            RaisePropertyChanged(nameof(CurrentGen));
        }

        public MvxCommand OptionsCommand { get; set; }

        private void Options()
        {
            PauseAll();

            string message = "Change Mutation Rate";
            MutationRateDialogViewModel dialog = new MutationRateDialogViewModel(message, _session.MutationRate);
            bool? result = _dialogService.ShowDialog(dialog);

            if (result.HasValue)
            {
                if(result.Value)
                {
                    _session.MutationRate = dialog.MutationRate;
                }
            }
        }

        public MvxAsyncCommand BackCommand { get; set; }

        private async Task GoBack()
        {
            PauseAll();

            // have to discard all training as well

            string question = "Leave training? Any unsaved progress will be lost.";
            YesNoDialogViewModel dialog = new YesNoDialogViewModel(question);
            bool? result = _dialogService.ShowDialog(dialog);

            if (result.HasValue)
            {
                if(result.Value)
                {
                    DestroyAllGenerations();
                    await _navigationService.Close(this);
                }
            }
        }

        private void DestroyAllGenerations()
        {
            DestroyFutureGenerations(-1);
            PlaybackCurrentTimeWatcher.Instance.Stop();
            PlaybackCurrentTimeWatcher.Instance.RemoveAllPlaybacks();
        }

        private void DestroyGeneration(SongsContainerViewModel gen)
        {
            if (_session.TotalGens <= 0)
                return;

            if (!_session.SongsContainers.Contains(gen))
                return;

            _trainingService.DestroyGeneration(gen.GenNum);

            gen.Dispose();
            _session.SongsContainers.Remove(gen);

            _session.TotalGens--;

            RaisePropertyChanged(nameof(CurrentContainer));
        }

        private void DestroyFutureGenerations(int currentGen)
        {
            var total = _session.TotalGens;
            List<SongsContainerViewModel> gensToDestroy = new List<SongsContainerViewModel>();
            for (int i = currentGen + 1; i < total; i++)
            {
                gensToDestroy.Add(_session.SongsContainers[i]);
            }

            foreach(SongsContainerViewModel gen in gensToDestroy)
            {
                DestroyGeneration(gen);
            }
        }

        public MvxCommand PrevGenCommand { get; set; }

        public MvxCommand NextGenCommand { get; set; }

        private void PreviousGeneration()
        {
            if (NotOnFirstGen)
            {
                PauseAll();
                ShowGeneration(_session.CurrentGen - 1);
            }
        }
        private void NextGeneration()
        {
            if (NotOnLastGen)
            {
                PauseAll();
                ShowGeneration(_session.CurrentGen + 1);
            }
        }

    }
}
