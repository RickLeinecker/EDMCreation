using MvvmCross;
using MvvmCross.ViewModels;
using EDMCreation.Core.Models;
using EDMCreation.Core.Services;
using EDMCreation.Core.ViewModels;
using MvvmCross.IoC;
using EDMCreation.Core.Utilities;
using EDMCreation.Core.Services.Interfaces;
using System;
using System.IO;
using System.Threading.Tasks;
using Python.Included;
using Python.Runtime;
using System.Diagnostics;

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

            CreatableTypes()
                .EndingWith("Service")
                .AsInterfaces()
                .RegisterAsLazySingleton();

            // must register client service first
            Mvx.IoCProvider.RegisterSingleton<IHttpClientService>(() => new HttpClientService("https://www.edmcreation.me:5000/api/"));
            Mvx.IoCProvider.ConstructAndRegisterSingleton<IOutputDeviceService, OutputDeviceService>();
            Mvx.IoCProvider.ConstructAndRegisterSingleton<IDataAccess, MongoDataAccess>();
            Mvx.IoCProvider.ConstructAndRegisterSingleton<IAuthenticationService, AuthenticationService>();

            RegisterCustomAppStart<AppStart>();
        }

    }
}
