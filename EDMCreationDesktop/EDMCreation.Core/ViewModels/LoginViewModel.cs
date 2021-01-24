using MvvmCross.Navigation;
using MvvmCross.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace EDMCreation.Core.ViewModels
{
    public class LoginViewModel : MvxViewModel
    {
        private readonly IMvxNavigationService _navigationService;

        public LoginViewModel(IMvxNavigationService navigationService)
        {
            _navigationService = navigationService;
        }
        public override async Task Initialize()
        {
            await base.Initialize();
        }

        public override void Prepare()
        {

        }

        
    }
}
