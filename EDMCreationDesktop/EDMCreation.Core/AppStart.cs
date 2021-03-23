using EDMCreation.Core.Services;
using MvvmCross.Navigation;
using MvvmCross.ViewModels;
using MvvmCross.Views;
using EDMCreation.Core.ViewModels;
using System.Threading.Tasks;
using MvvmCross.Exceptions;
using EDMCreation.Core.Services.Interfaces;

namespace EDMCreation.Core
{
	public class AppStart : MvxAppStart<LaunchPageViewModel>
	{
		private readonly IAuthenticationService _authenticationService;

		public AppStart(IMvxApplication application, IMvxNavigationService navigationService, IAuthenticationService authenticationService) : base(application, navigationService)
		{
			_authenticationService = authenticationService;
		}
	}
}
