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
using EDMCreation.Core.Services;

namespace EDMCreation.Core.ViewModels
{
    public class SongGenerationViewModel : MvxViewModel
    {
        public override Task Initialize()
        {
            return base.Initialize();
        }

        private IMvxNavigationService _navigationService;
        private IMidiPlayerService _midiPlayer;

        public IMidiPlayerService MidiPlayer
        {
            get { return _midiPlayer; }
        }

        private static string _currentFile;

        public string CurrentFile
        {
            get { return _currentFile; }
            set { SetProperty(ref _currentFile, value); }
        }

        private readonly List<string> _midiFiles;
        public List<string> MidiFiles { get { return _midiFiles; } }

        public SongGenerationViewModel(IMvxNavigationService navigationService, IMidiPlayerService midiPlayerService)
        {
            _navigationService = navigationService;
            _midiPlayer = midiPlayerService;

            PlayCommand = new MvxAsyncCommand<string>(fileName => PlayFileAsync(fileName));
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

        public async Task PlayFileAsync(string fileName)
        {
            await _midiPlayer.PlayAsync(fileName);
        }

        public MvxCommand StopCommand { get; set; }

        public void Stop()
        {
            _midiPlayer.Stop();
        }

        public MvxAsyncCommand BackCommand { get; set; }

        public async Task GoBack()
        {
            await _navigationService.Close(this);
        }

    }
}
