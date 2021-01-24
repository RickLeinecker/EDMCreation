using MvvmCross.ViewModels;
using System.IO;
using System.Threading.Tasks;
using System.Reflection;
using System;
using MvvmCross.Commands;
using MvvmCross.Navigation;

namespace EDMCreation.Core.ViewModels
{
    public class LaunchPageViewModel : MvxViewModel
    {
        private readonly IMvxNavigationService _navigationService;

        public LaunchPageViewModel(IMvxNavigationService navigationService)
        {
            _navigationService = navigationService;
            ShowCreateAccountViewCommand = new MvxCommand(ShowCreateAccountView);
            ShowLoginViewCommand = new MvxCommand(ShowLoginView);
        }
        public override async Task Initialize()
        {
            await base.Initialize();
        }

        private string _solutionUri = Directory.GetParent(Environment.CurrentDirectory).Parent.Parent.Parent.FullName;
        private string _logoUri = "EDMCreation.Core\\Images\\temp_logo.png";

        public string LogoUri
        {
            get
            {
                return Path.Combine(_solutionUri, _logoUri);
            }
        }

        public MvxCommand ShowCreateAccountViewCommand { get; set; }
        public void ShowCreateAccountView()
        {
            _navigationService.Navigate<CreateAccountViewModel>();
        }
        public MvxCommand ShowLoginViewCommand { get; set; }
        public void ShowLoginView()
        {
            _navigationService.Navigate<LoginViewModel>();
        }

    }
}
