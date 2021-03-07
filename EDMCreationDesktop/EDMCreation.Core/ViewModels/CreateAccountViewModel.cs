using EDMCreation.Core.Models;
using MvvmCross.Commands;
using MvvmCross.Navigation;
using MvvmCross.ViewModels;
using System.Threading.Tasks;

namespace EDMCreation.Core.ViewModels
{
    public class CreateAccountViewModel : MvxViewModel
    {
        private readonly IMvxNavigationService _navigationService;

        public CreateAccountViewModel(IMvxNavigationService navigationService)
        {
            _navigationService = navigationService;
            ShowLoginViewCommand = new MvxCommand(ShowLoginView);
        }

        public override void Prepare()
        {
            base.Prepare();
        }

        public override async Task Initialize()
        {
            await base.Initialize();
        }

        private string _text;
        public string Text { get { return _text; } set { SetProperty(ref _text, value); } }

        public MvxCommand ShowLoginViewCommand { get; set; }
        public void ShowLoginView()
        {
            _navigationService.Navigate<LoginViewModel>();
        }

    }
}
