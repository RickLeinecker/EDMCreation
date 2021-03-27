using MvvmCross.ViewModels;
using MvvmCross.Commands;
using MvvmCross.Navigation;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using EDMCreation.Core.Services.Interfaces;
using EDMCreation.Core.Models;

namespace EDMCreation.Core.ViewModels
{
    public class SelectGenreViewModel : MvxViewModel
    {
        private readonly IMvxNavigationService _navigationService;
        private readonly IGenreService _genreService;

        private readonly List<GenreModel> _genres;
        public List<GenreModel> Genres { get { return _genres; } }

        public SelectGenreViewModel(IMvxNavigationService navigationService, IGenreService genreService)
        {
            _navigationService = navigationService;
            _genreService = genreService;

            BackCommand = new MvxAsyncCommand(GoBack);
            ShowSongGenerationViewCommand = new MvxAsyncCommand(ShowSongGenerationView);

            _genres = _genreService.Genres;
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
    
