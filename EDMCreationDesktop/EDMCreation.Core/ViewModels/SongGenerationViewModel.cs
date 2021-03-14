using MvvmCross.ViewModels;
using MvvmCross.Commands;
using MvvmCross.Navigation;
using Melanchall.DryWetMidi.Core;
using Melanchall.DryWetMidi.Devices;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EDMCreation.Core.ViewModels
{
    public class SongGenerationViewModel :MvxViewModel
    {
        public override Task Initialize()
        {
            return base.Initialize();
        }

        private IMvxNavigationService _navigationService;
        private static Playback _playback;
        private readonly List<string> _midiFiles;
        public List<string> MidiFiles { get { return _midiFiles; } }


        public SongGenerationViewModel(IMvxNavigationService navigationService)
        {
            _navigationService = navigationService;
            PlayCommand = new MvxAsyncCommand<string>(fileName => PlayAsync(fileName));
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
            var midiFile = MidiFile.Read(fileName);
            var outputDevice = OutputDevice.GetByName("Microsoft GS Wavetable Synth");
            _playback = midiFile.GetPlayback(outputDevice);

            await Task.Run(() =>
            {
                _playback.Start();
                SpinWait.SpinUntil(() => !_playback.IsRunning);
            });

            outputDevice.Dispose();
            _playback.Dispose();
        }

        public MvxAsyncCommand BackCommand { get; set; }

        public async Task GoBack()
        {
            await _navigationService.Close(this);
        }

    }
}
