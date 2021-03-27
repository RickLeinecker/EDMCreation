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

		public AppStart(IMvxApplication application, IMvxNavigationService navigationService) : base(application, navigationService)
		{
		}
	}
}
