using MvvmCross.ViewModels;
using MvvmCross.Commands;
using MvvmCross.Navigation;
using System.Collections.Generic;
using System.Threading.Tasks;
using EDMCreation.Core.Services;
using System.Diagnostics;

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

        private List<string> _songs;
        public List<string> Songs { get { return _songs; } }

        private List<SongViewModel> _songContainers;
        public List<SongViewModel> SongContainers { get { return _songContainers; } }

        public SongGenerationViewModel(IMvxNavigationService navigationService, IMidiPlayerService midiPlayerService)
        {
            _navigationService = navigationService;
            _midiPlayer = midiPlayerService;

            BackCommand = new MvxAsyncCommand(GoBack);

            GenerateSongs();
        }

        public void GenerateSongs()
        {
            _songs = new List<string>()
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

            _songContainers = new List<SongViewModel>();

            int i = 1;
            foreach (string midiFile in _songs)
            {
                _songContainers.Add(new SongViewModel(_midiPlayer) { MidiFile = midiFile, SongNumber = i });
                i++;
            }
        }

        

        public MvxAsyncCommand BackCommand { get; set; }

        public async Task GoBack()
        {
            _midiPlayer.Stop();
            await _navigationService.Close(this);
        }
    }
}
