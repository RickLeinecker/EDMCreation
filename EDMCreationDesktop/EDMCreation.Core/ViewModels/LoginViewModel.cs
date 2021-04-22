using EDMCreation.Core.Models;
using EDMCreation.Core.Services.Interfaces;
using EDMCreation.Core.Utilities;
using EDMCreation.Core.ViewModels.Dialogs;
using MvvmCross.Commands;
using MvvmCross.Navigation;
using MvvmCross.ViewModels;
using System;
using System.IO;
using System.Threading.Tasks;

namespace EDMCreation.Core.ViewModels
{
    public class LoginViewModel : MvxViewModel
    {
        private UserModel user;

        public UserModel User { get { return user; } set { SetProperty(ref user, value); } }

        private readonly IMvxNavigationService _navigationService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IDialogService _dialogService;
        public LoginViewModel(IMvxNavigationService navigationService, IAuthenticationService loginService, IDialogService dialogService, IDataAccess dataAccess)
        {
            user = new UserModel();

            _navigationService = navigationService;
            _authenticationService = loginService;
            _dialogService = dialogService;

            BackCommand = new MvxAsyncCommand(GoBack);
            LoginCommand = new MvxAsyncCommand(Login);
        }

        public MvxAsyncCommand LoginCommand { get; set; }

        public async Task Login()
        {
            bool result = await _authenticationService.Login(user);

            if (result)
            {
                // login successful, go to song gen page with training file
                // this needs to be updated

                //Stream trainingFile = await _dataAccess.LoadTrainingFile();
                //SessionModel session = new SessionModel(trainingFile);
                //await _navigationService.Navigate<SongGenerationViewModel, SessionModel>(session);
            }
            else
            {
                string message = "Login unsuccessful.";
                InformationDialogViewModel dialog = new InformationDialogViewModel(message);
                _dialogService.ShowDialog(dialog);
            }

        }
        public MvxAsyncCommand BackCommand { get; set; }

        public async Task GoBack()
        {
            await _navigationService.Close(this);
        }
    }
}
