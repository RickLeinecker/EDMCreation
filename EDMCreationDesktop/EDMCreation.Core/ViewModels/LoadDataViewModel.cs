using System;
using System.Collections.Generic;
using System.Text;
using MvvmCross.Commands;
using MvvmCross.Navigation;
using MvvmCross.ViewModels;

using System.Threading.Tasks;
using EDMCreation.Core.Services.Interfaces;
using EDMCreation.Core.Models;
using EDMCreation.Core.Utilities;
using EDMCreation.Core.ViewModels.Dialogs;
using System.IO.Compression;

namespace EDMCreation.Core.ViewModels
{
    public class LoadDataViewModel : MvxViewModel
    {
        public string Test { get; set; }

        private readonly IMvxNavigationService _navigationService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IDataAccess _dataAccess;
        private readonly IDialogService _dialogService;
        public LoadDataViewModel(IMvxNavigationService navigationService, IAuthenticationService authenticationService, 
            IDataAccess dataAccess, IDialogService dialogService)
        {
            _navigationService = navigationService;
            _authenticationService = authenticationService;
            _dataAccess = dataAccess;
            _dialogService = dialogService;

            BackCommand = new MvxAsyncCommand(GoBack);
            LoadFromAccountCommand = new MvxAsyncCommand(LoadFromAccount);
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

        public MvxAsyncCommand LoadFromAccountCommand { get; set; }

        private async Task LoadFromAccount()
        {
            if (!_authenticationService.IsAuthenticated)
            {
                string message = "Please login to continue.";
                LoginDialogViewModel dialog = new LoginDialogViewModel(message);
                bool? result = _dialogService.ShowDialog(dialog);

                if (result.HasValue)
                {
                    if (result.Value) // yes, login success
                    {
                        await GoToGenerationPage();
                    }
                    else
                        return;
                }
            }

            else // we are authenticated, just go to song gen page with file
                await GoToGenerationPage();
        }

        private async Task GoToGenerationPage()
        {
            ZipArchive archive = await _dataAccess.LoadTrainingFile();
            SessionModel session = new SessionModel(new TrainingFile(archive));
            await _navigationService.Navigate<SongGenerationViewModel, SessionModel>(session);
        }

    }
}
