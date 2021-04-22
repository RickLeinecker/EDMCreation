using EDMCreation.Core.Models;
using EDMCreation.Core.Services.Interfaces;
using MvvmCross;
using System.Threading.Tasks;

namespace EDMCreation.Core.ViewModels.Dialogs
{
    public class LoginDialogViewModel : BaseDialogViewModel, IDialogRequestClose
    {
        private UserModel user;
        public UserModel User { get { return user; } set { user = value; } }

        private IAuthenticationService _authenticationService;
        private IDialogService _dialogService;

        public LoginDialogViewModel(string message) : base(message)
        {
            user = new UserModel();

            _authenticationService = Mvx.IoCProvider.Resolve<IAuthenticationService>();
            _dialogService = Mvx.IoCProvider.Resolve<IDialogService>();
        }
        
        protected override async Task Ok()
        {
            // do login
            bool result = await _authenticationService.Login(user);

            if (result)
            {
                // login successful
                await base.Ok();
            }
            else
            {
                string message = "Login unsuccessful.";
                InformationDialogViewModel dialog = new InformationDialogViewModel(message);
                _dialogService.ShowDialog(dialog);
            }
        }
    }
}
