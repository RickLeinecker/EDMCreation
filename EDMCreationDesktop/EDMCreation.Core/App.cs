using MvvmCross;
using MvvmCross.ViewModels;
using EDMCreation.Core.Models;
using EDMCreation.Core.Services;
using EDMCreation.Core.ViewModels;
using MvvmCross.IoC;
using MongoDB.Driver;
using EDMCreation.Core.Utilities;
using EDMCreation.Core.Services.Interfaces;
using System;
using System.IO;
using System.Threading.Tasks;
using Python.Included;
using Python.Runtime;

namespace EDMCreation.Core
{
    public class App : MvxApplication
    {
        public override void Initialize()
        {
            Installer.InstallPath = Path.GetFullPath(".");

            // install the embedded python distribution
            Installer.SetupPython();

            // install pip3 for package installation
            Installer.TryInstallPip();

            Installer.LogMessage += Console.WriteLine;

            Installer.PipInstallModule("tensorflow");
            Installer.PipInstallModule("keras");
            Installer.PipInstallModule("numpy");
            Installer.PipInstallModule("mido");




            //Keras.Keras.DisablePySysConsoleLog = true;

            CreatableTypes()
                .EndingWith("Service")
                .AsInterfaces()
                .RegisterAsLazySingleton();

            Mvx.IoCProvider.RegisterSingleton<IMongoClient>(new MongoClient(@"mongodb+srv://admin:LeineckerGroup16@cluster0.ttjwc.mongodb.net"));
            Mvx.IoCProvider.ConstructAndRegisterSingleton<IDataAccess, MongoDataAccess>();
            Mvx.IoCProvider.ConstructAndRegisterSingleton<IAuthenticationService, AuthenticationService>();

            RegisterCustomAppStart<AppStart>();
        }

    }
}
