using MvvmCross.ViewModels;
using MvvmCross.Commands;
using MvvmCross.Navigation;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace EDMCreation.Core.ViewModels
{
    public class SelectGenreViewModel : MvxViewModel
    {
        private IMvxNavigationService _navigationService;
        public SelectGenreViewModel(IMvxNavigationService navigationService)
        {
            _navigationService = navigationService;
            BackCommand = new MvxAsyncCommand(GoBack);
            ShowSongGenerationViewCommand = new MvxAsyncCommand(ShowSongGenerationView);
        }
        public MvxAsyncCommand BackCommand { get; set; }

        public async Task GoBack()
        {
            await _navigationService.Close(this);
        }

        public MvxAsyncCommand ShowSongGenerationViewCommand { get; set; }

        public async Task ShowSongGenerationView()
        {
            await _navigationService.Navigate<SongGenerationViewModel>();
        }
    }
}
    
