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
        private readonly IMvxNavigationService _navigationService;

        private readonly List<string> _genres;
        public List<string> Genres { get { return _genres; } }

        public SelectGenreViewModel(IMvxNavigationService navigationService)
        {
            _navigationService = navigationService;
            BackCommand = new MvxAsyncCommand(GoBack);
            ShowSongGenerationViewCommand = new MvxAsyncCommand(ShowSongGenerationView);
            _genres = new List<string>(){ "Genre 1", "Genre 2", "Genre 3", "Genre 4", "Genre 5", "Genre 6", "Genre 7" };
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
    
