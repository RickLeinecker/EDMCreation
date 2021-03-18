using MvvmCross.ViewModels;
using System.IO;
using System.Threading.Tasks;
using System.Reflection;
using System;
using MvvmCross.Commands;
using MvvmCross.Navigation;
using EDMCreation.Core.Models;
using Melanchall.DryWetMidi.Core;
using Melanchall.DryWetMidi.Devices;
using System.Threading;

namespace EDMCreation.Core.ViewModels
{
    public class LaunchPageViewModel : MvxViewModel
    {
        private readonly IMvxNavigationService _navigationService;

        public LaunchPageViewModel(IMvxNavigationService navigationService)
        {
            _navigationService = navigationService;
            
            ShowLoadDataViewCommand = new MvxAsyncCommand(ShowLoadDataView);
            ShowSelectGenreViewCommand = new MvxAsyncCommand(ShowSelectGenreView);
            BackCommand = new MvxAsyncCommand(GoBack);
        }

        public MvxAsyncCommand ShowLoadDataViewCommand { get; set; }

        public async Task ShowLoadDataView()
        {
            await _navigationService.Navigate<LoadDataViewModel>();
        }
        public MvxAsyncCommand ShowSelectGenreViewCommand { get; set; }

        public async Task ShowSelectGenreView()
        {
            await _navigationService.Navigate<SelectGenreViewModel>();
        }

        public MvxAsyncCommand BackCommand { get; set; }

        public async Task GoBack()
        {
            await _navigationService.Close(this);
        }


    }
}
