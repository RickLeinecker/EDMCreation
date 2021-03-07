using System;
using System.Collections.Generic;
using System.Text;
using MvvmCross.Commands;
using MvvmCross.Navigation;
using MvvmCross.ViewModels;
using MvvmCross.Commands;

using System.Threading.Tasks;

namespace EDMCreation.Core.ViewModels
{
    public class LoadDataViewModel : MvxViewModel
    {
        IMvxNavigationService _navigationService;
        public LoadDataViewModel(IMvxNavigationService navigationService)
        {
            _navigationService = navigationService;
            BackCommand = new MvxAsyncCommand(GoBack);
            ShowLoginViewCommand = new MvxAsyncCommand(ShowLoginView);
        }

        public MvxAsyncCommand BackCommand { get; set; }

        public async Task GoBack()
        {
            await _navigationService.Close(this);
        }

        public MvxAsyncCommand ShowLoginViewCommand { get; set; }

        public async Task ShowLoginView()
        {
            await _navigationService.Navigate<LoginViewModel>();
        }

    }
}
