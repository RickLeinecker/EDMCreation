using MvvmCross.ViewModels;
using MvvmCross.Commands;
using MvvmCross.Navigation;
using Melanchall.DryWetMidi.Core;
using Melanchall.DryWetMidi.Devices;
using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EDMCreation.Core.ViewModels
{
    public class SongGenerationViewModel : MvxViewModel
    {
        public override Task Initialize()
        {
            return base.Initialize();
        }

        private IMvxNavigationService _navigationService;
        private static Playback _playback;
        private static OutputDevice _outputDevice;
        private readonly List<string> _midiFiles;
        public List<string> MidiFiles { get { return _midiFiles; } }

        private static bool _isPlaying;

        public bool IsPlaying 
        {
            get { return _isPlaying; }
            set { SetProperty(ref _isPlaying, value); }
        }

        private static string _currentFile;

        public string CurrentFile
        {
            get { return _currentFile; }
            set { SetProperty(ref _currentFile, value); }
        }

        public SongGenerationViewModel(IMvxNavigationService navigationService)
        {
            Debug.WriteLine("Enter song gen view");
            _navigationService = navigationService;
            PlayCommand = new MvxAsyncCommand<string>(fileName => PlayAsync(fileName));
            StopCommand = new MvxCommand(Stop);
            BackCommand = new MvxAsyncCommand(GoBack);
            _midiFiles = new List<string>()
            {
                @"C:\Users\jakeg\OneDrive\Desktop\github_repositories\EDMCreation\EDMCreationDesktop\EDMCreation.Core\ViewModels\test.mid",
                @"C:\Users\jakeg\OneDrive\Desktop\github_repositories\EDMCreation\EDMCreationDesktop\EDMCreation.Core\ViewModels\test2.mid",
                @"C:\Users\jakeg\OneDrive\Desktop\github_repositories\EDMCreation\EDMCreationDesktop\EDMCreation.Core\ViewModels\test3.mid",
                @"C:\Users\jakeg\OneDrive\Desktop\github_repositories\EDMCreation\EDMCreationDesktop\EDMCreation.Core\ViewModels\test.mid",
                @"C:\Users\jakeg\OneDrive\Desktop\github_repositories\EDMCreation\EDMCreationDesktop\EDMCreation.Core\ViewModels\test2.mid",
                @"C:\Users\jakeg\OneDrive\Desktop\github_repositories\EDMCreation\EDMCreationDesktop\EDMCreation.Core\ViewModels\test3.mid",
                @"C:\Users\jakeg\OneDrive\Desktop\github_repositories\EDMCreation\EDMCreationDesktop\EDMCreation.Core\ViewModels\test.mid",
                @"C:\Users\jakeg\OneDrive\Desktop\github_repositories\EDMCreation\EDMCreationDesktop\EDMCreation.Core\ViewModels\test2.mid",
                @"C:\Users\jakeg\OneDrive\Desktop\github_repositories\EDMCreation\EDMCreationDesktop\EDMCreation.Core\ViewModels\test3.mid",
                @"C:\Users\jakeg\OneDrive\Desktop\github_repositories\EDMCreation\EDMCreationDesktop\EDMCreation.Core\ViewModels\test.mid"
            };
        }

        public MvxAsyncCommand<string> PlayCommand { get; set; }

        public async Task PlayAsync(string fileName)
        {
            Stop();

            CurrentFile = fileName;
            var midiFile = MidiFile.Read(fileName);
            _outputDevice = OutputDevice.GetByName("Microsoft GS Wavetable Synth");
            _playback = midiFile.GetPlayback(_outputDevice);
            _playback.Finished += PlaybackEnded;
            _playback.Stopped += PlaybackEnded;


            await Task.Run(() =>
            {
                IsPlaying = true;
                _playback.Start();
            });

           
        }


        public void PlaybackEnded(object sender, EventArgs e)
        {
            IsPlaying = false;
            _outputDevice.Dispose();
            _playback.Dispose();
        }

        public MvxCommand StopCommand { get; set; }

        public void Stop()
        {
            if (_playback != null && _playback.IsRunning)
            {
                _playback.Stop();
            }
        }

        public MvxAsyncCommand BackCommand { get; set; }

        public async Task GoBack()
        {
            await _navigationService.Close(this);
        }

    }
}
