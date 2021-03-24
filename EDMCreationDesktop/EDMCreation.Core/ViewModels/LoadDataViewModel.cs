using System;
using System.Collections.Generic;
using System.Text;
using MvvmCross.Commands;
using MvvmCross.Navigation;
using MvvmCross.ViewModels;

using System.Threading.Tasks;
using EDMCreation.Core.Services.Interfaces;

namespace EDMCreation.Core.ViewModels
{
    public class LoadDataViewModel : MvxViewModel
    {
        public string Test { get; set; }

        private readonly IMvxNavigationService _navigationService;
        public LoadDataViewModel(IMvxNavigationService navigationService)
        {
            _navigationService = navigationService;

            BackCommand = new MvxAsyncCommand(GoBack);
            ShowLoginViewCommand = new MvxAsyncCommand(ShowLoginView);
            HandleFileCommand = new MvxCommand<string>(s => { HandleFile(s); });
        }

        public MvxCommand<string> HandleFileCommand { get; set; }
        public void HandleFile(string s)
        {
            Test = s;
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
