using System;
using System.Collections.Generic;
using System.Text;
using MvvmCross.Commands;
using MvvmCross.Navigation;
using MvvmCross.ViewModels;

using System.Threading.Tasks;
using EDMCreation.Core.Services.Interfaces;
using EDMCreation.Core.Models;

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
            HandleFileCommand = new MvxAsyncCommand<string>( async (s) => { await HandleFile(s); });
        }

        public MvxAsyncCommand<string> HandleFileCommand { get; set; }
        public async Task HandleFile(string s)
        {
            SessionModel session = new SessionModel(new TrainingFile(s));
            await _navigationService.Navigate<SongGenerationViewModel, SessionModel>(session);
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
