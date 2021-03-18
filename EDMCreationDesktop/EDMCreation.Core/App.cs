using MvvmCross;
using MvvmCross.ViewModels;
using EDMCreation.Core.Models;
using EDMCreation.Core.Services;
using EDMCreation.Core.ViewModels;
using MvvmCross.IoC;
using MongoDB.Driver;
using EDMCreation.Core.Utilities;

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

            Mvx.IoCProvider.RegisterSingleton<IMongoClient>(new MongoClient(@"mongodb+srv://admin:LeineckerGroup16@cluster0.ttjwc.mongodb.net"));
            Mvx.IoCProvider.ConstructAndRegisterSingleton<IDataAccess, MongoDataAccess>();
            // Mvx.IoCProvider.ConstructAndRegisterSingleton<IDataAccess, MongoDataAccess>();
            Mvx.IoCProvider.ConstructAndRegisterSingleton<IAuthenticationService, AuthenticationService>();

            RegisterCustomAppStart<AppStart>();
        }
    }
}
