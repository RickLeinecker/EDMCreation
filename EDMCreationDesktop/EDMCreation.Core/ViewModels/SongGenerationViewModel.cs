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

namespace EDMCreation.Core.ViewModels
{
    public class SongGenerationViewModel : MvxViewModel<string>
    {
        public override void Prepare()
        {
            _trainingFile = GenerateNewTrainingFile();
            base.Prepare();
        }

        public override void Prepare(string trainingFile)
        {
            _trainingFile = trainingFile;
            base.Prepare();
        }

        public override Task Initialize()
        {

            return base.Initialize();
        }

        private readonly IMvxNavigationService _navigationService;
        private readonly ITrainingService _trainingService;
        private readonly IDialogService _dialogService;

        private string _trainingFile;

        private readonly List<string> _currentSongFiles;
        private List<SongViewModel> _currentSongPanels;
        private int _totalGens;

        public EmptyContainerViewModel EmptyContainer;

        private MvxViewModel _currentContainer;
        public MvxViewModel CurrentContainer { get { return _currentContainer; } }

        private int _currentGen;
        public int CurrentGen { get { return _currentGen; } }

        private bool _notOnFirstGen;
        public bool NotOnFirstGen { get { return _notOnFirstGen; } set { SetProperty(ref _notOnFirstGen, value); } }

        private bool _notOnLastGen;
        public bool NotOnLastGen { get { return _notOnLastGen; } set { SetProperty(ref _notOnLastGen, value); } }


        private readonly List<SongsContainerViewModel> _songsContainers;

        public SongGenerationViewModel(IMvxNavigationService navigationService, ITrainingService trainingService, IDialogService dialogService)
        {
            _navigationService = navigationService;
            _trainingService = trainingService;
            _dialogService = dialogService;

            BackCommand = new MvxAsyncCommand(GoBack);
            PrevGenCommand = new MvxCommand(PreviousGeneration);
            NextGenCommand = new MvxCommand(NextGeneration);
            GenerateCommand = new MvxCommand(Generate);

            EmptyContainer = new EmptyContainerViewModel();

            // use training file to check for progress
            // if new project, generate 10 songs, otherwise load the latest generation

            // assumes initial entry with no prior training
            _songsContainers = new List<SongsContainerViewModel>();
            _currentSongPanels = new List<SongViewModel>();
            _currentSongFiles = new List<string>();
            _totalGens = 0;
            _currentGen = -1;
            _currentContainer = EmptyContainer;

            PlaybackCurrentTimeWatcher.Instance.Start(); // remember to stop this at some point, and reassign playbacks when the view switches

        }

        public MvxCommand GenerateCommand { get; set; }
        public void Generate()
        {
            PauseAll();

            if (_currentGen + 1 != _totalGens)
            {
                string question = "You are on a previous generation. This will overwrite any future generations. Generate?";
                YesNoDialogViewModel dialog = new YesNoDialogViewModel(question);
                bool? result = _dialogService.ShowDialog(dialog);

                if (result.HasValue)
                {
                    if (result.Value) // yes, delete future generations
                    {
                        DestroyFutureGenerations(_currentGen);
                    }
                    else
                        return;
                }
            }

            GenerateAndShowNext();
        }

        public void GenerateAndShowNext()
        {
            GenerateNext();
            _currentGen++;
            ShowGeneration(_currentGen);
        }

        public void GenerateNext()
        {
            // generates the next generation without updating view
            var songFiles = _trainingService.GenerateSongs(_currentSongFiles); // uses test files for now

            var songPanels = GenerateSongPanels(songFiles);

            SongsContainerViewModel container = new SongsContainerViewModel(_currentGen + 1, songPanels);
            _songsContainers.Add(container);
            _totalGens++;

        }

        public List<SongViewModel> GenerateSongPanels(List<string> songFiles)
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
            foreach(SongViewModel song in _currentSongPanels)
            {
                if (song.IsPlaying)
                    song.Pause();
            }
        }

        private void StopAll()
        {
            foreach(SongViewModel song in _currentSongPanels)
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

            foreach (SongViewModel s in _currentSongPanels)
            {
                s.StopWatching();
            }

            _currentGen = gen;
            _currentContainer = _songsContainers[gen];
            _currentSongPanels = _songsContainers[gen].Songs;

            _currentSongFiles.Clear();

            foreach (SongViewModel s in _currentSongPanels)
            {
                _currentSongFiles.Add(s.MidiFilePath);
                s.StartWatching();
            }

            if (_currentGen == 0)
                NotOnFirstGen = false;
            if (_currentGen + 1 == _totalGens)
                NotOnLastGen = false;

            RaisePropertyChanged(nameof(CurrentContainer));
            RaisePropertyChanged(nameof(CurrentGen));
        }

        // Does nothing right now
        private string GenerateNewTrainingFile()
        {
            return "placeholder.txt";
        }

        public MvxAsyncCommand BackCommand { get; set; }

        public async Task GoBack()
        {
            PauseAll();

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
            if (_totalGens <= 0)
                return;

            if (!_songsContainers.Contains(gen))
                return;

            gen.Dispose();
            _songsContainers.Remove(gen);

            _totalGens--;

            RaisePropertyChanged(nameof(CurrentContainer));
        }

        private void DestroyFutureGenerations(int currentGen)
        {
            var total = _totalGens;
            List<SongsContainerViewModel> gensToDestroy = new List<SongsContainerViewModel>();
            for (int i = currentGen + 1; i < total; i++)
            {
                gensToDestroy.Add(_songsContainers[i]);
            }

            foreach(SongsContainerViewModel gen in gensToDestroy)
            {
                DestroyGeneration(gen);
            }
        }

        public MvxCommand PrevGenCommand { get; set; }

        public MvxCommand NextGenCommand { get; set; }

        public void PreviousGeneration()
        {
            if (NotOnFirstGen)
            {
                PauseAll();
                ShowGeneration(_currentGen - 1);
            }
        }
        public void NextGeneration()
        {
            if (NotOnLastGen)
            {
                PauseAll();
                ShowGeneration(_currentGen + 1);
            }
        }

    }
}
