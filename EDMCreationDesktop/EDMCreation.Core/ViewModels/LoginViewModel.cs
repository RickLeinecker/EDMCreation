using EDMCreation.Core.Models;
using EDMCreation.Core.Services.Interfaces;
using MvvmCross.Commands;
using MvvmCross.Navigation;
using MvvmCross.ViewModels;
using System;
using System.Threading.Tasks;

namespace EDMCreation.Core.ViewModels
{
    public class LoginViewModel : MvxViewModel
    {
        public override async Task Initialize()
        {
            await base.Initialize();
        }

        public override void Prepare()
        {
            _email = "";
            _password = "";
        }

        private string _email;

        public string Email
        { 
            get { return _email; } 
            set { SetProperty(ref _email, value); }
        }

        private string _password;

        public string Password
        {
            get { return _password; }
            set { SetProperty(ref _password, value); }
        }

        private readonly IMvxNavigationService _navigationService;
        private readonly IAuthenticationService _authenticationService;

        public LoginViewModel(IMvxNavigationService navigationService, IAuthenticationService loginService)
        {
            _navigationService = navigationService;
            _authenticationService = loginService;
            BackCommand = new MvxAsyncCommand(GoBack);
        }

        public MvxAsyncCommand BackCommand { get; set; }

        public async Task GoBack()
        {
            await _navigationService.Close(this);
        }
    }
}
