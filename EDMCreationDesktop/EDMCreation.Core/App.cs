using MvvmCross;
using MvvmCross.ViewModels;
using EDMCreation.Core.Models;
using EDMCreation.Core.Services;
using EDMCreation.Core.ViewModels;
using MvvmCross.IoC;

namespace EDMCreation.Core
{
    public class App : MvxApplication
    {
        public override void Initialize()
        {
            CreatableTypes()
                .EndingWith("Service")
                .AsInterfaces()
                .RegisterAsLazySingleton();

            RegisterAppStart<LaunchPageViewModel>();
        }
    }
}
