using MvvmCross.ViewModels;
using MvvmCross.Commands;
using MvvmCross.Navigation;
using System.Collections.Generic;
using System.Threading.Tasks;
using MvvmCross.Presenters;
using EDMCreation.Core.Utilities;
using System.Diagnostics;
using MvvmCross.Presenters.Hints;
using MvvmCross;
using System;
using Melanchall.DryWetMidi.Devices;
using EDMCreation.Core.Services.Interfaces;

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

        private IMvxNavigationService _navigationService;
        private ITrainingService _trainingService;

        private string _trainingFile;

        private List<string> _currentSongs;
        public List<string> CurrentSongs { get { return _currentSongs; } }

        private SongsContainerViewModel _currentContainer;
        public SongsContainerViewModel CurrentContainer { get { return _currentContainer; } }

        private int _currentGen;
        public int CurrentGen { get { return _currentGen; } set { SetProperty(ref _currentGen, value); } }

        private int _totalGens;
        public int TotalGens { get { return _totalGens; } set { SetProperty(ref _totalGens, value); } }

        private bool _notOnFirstGen;
        public bool NotOnFirstGen { get { return _notOnFirstGen; } set { SetProperty(ref _notOnFirstGen, value); } }

        private bool _notOnLastGen;
        public bool NotOnLastGen { get { return _notOnLastGen; } set { SetProperty(ref _notOnLastGen, value); } }

        private List<SongViewModel> _currentSongPanels;
        public List<SongViewModel> CurrentSongPanels { get { return _currentSongPanels; } }

        private List<SongsContainerViewModel> _songsContainers;
        public List<SongsContainerViewModel> SongsContainers { get { return _songsContainers; } }

        public SongGenerationViewModel(IMvxNavigationService navigationService, ITrainingService trainingService)
        {
            _navigationService = navigationService;
            _trainingService = trainingService;

            BackCommand = new MvxAsyncCommand(GoBack);
            PrevGenCommand = new MvxCommand(PreviousGeneration);
            NextGenCommand = new MvxCommand(NextGeneration);
            ShowCommand = new MvxCommand(Show);

            // use training file to check for progress
            // if new project, generate 10 songs, otherwise load the latest generation

            // assumes initial entry with no prior training
            _songsContainers = new List<SongsContainerViewModel>();
            _totalGens = 0;
            _currentGen = -1;
            GenerateAndShowNext();
            PlaybackCurrentTimeWatcher.Instance.Start(); // remember to stop this at some point, and reassign playbacks when the view switches

        }

        public void GenerateAndShowNext()
        {
            GenerateNext();
            _currentGen++;
            ShowGeneration(_currentGen);
        }

        public void GenerateNext()
        {
            // user has returned to previous generation and is going to overwrite later generations
            if (_currentGen + 1 != _totalGens)
            {
                // ...
            }

            else // user is using the youngest generation
            {
                _currentSongs = _trainingService.GenerateSongs(_currentSongs); // uses test files for now

                _currentSongPanels = GenerateSongPanels();

                _currentContainer = new SongsContainerViewModel(_currentGen + 1, _currentSongPanels);
                _songsContainers.Add(_currentContainer);
                _totalGens++;
            }
            
        }

        public List<SongViewModel> GenerateSongPanels()
        {
            int i = 0;
            List<SongViewModel> songPanels = new List<SongViewModel>();

            foreach (string s in _currentSongs)
            {
                IMidiPlayer midiPlayer = new MidiPlayer(s);
                SongViewModel songPanel = new SongViewModel(midiPlayer, i);
                midiPlayer.AddToPlaybackWatcher();
                songPanels.Add(songPanel);
                i++;
            }

            return songPanels;
        }

        public void ShowGeneration(int gen)
        {
            NotOnFirstGen = true;
            NotOnLastGen = true;

            _currentGen = gen;
            _currentContainer = _songsContainers[gen];

            if (_currentGen == 0)
                NotOnFirstGen = false;
            if (_currentGen + 1 == _totalGens)
                NotOnLastGen = false;

            RaisePropertyChanged(nameof(CurrentContainer));
        }

        // Does nothing right now
        public string GenerateNewTrainingFile()
        {
            return "placeholder.txt";
        }

        public MvxAsyncCommand BackCommand { get; set; }

        public async Task GoBack()
        {
            await _navigationService.Close(this);
        }

        public MvxCommand PrevGenCommand { get; set; }

        public MvxCommand NextGenCommand { get; set; }

        public void PreviousGeneration()
        {
            if (NotOnFirstGen)
                ShowGeneration(_currentGen - 1);
        }
        public void NextGeneration()
        {
            if (NotOnLastGen)
                ShowGeneration(_currentGen + 1);
        }

        // for testing purposed
        public MvxCommand ShowCommand { get; set; }

        public void Show()
        {
            ShowGeneration(0);
        }
    }
}
