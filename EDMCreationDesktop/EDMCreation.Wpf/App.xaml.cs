using MvvmCross.Core;
using MvvmCross.Platforms.Wpf.Core;
using MvvmCross.Platforms.Wpf.Views;
using MvvmCross.Platforms.Wpf.Presenters;
using System;
using EDMCreation.Wpf.Views;
using MvvmCross;
using EDMCreation.Core.Services.Interfaces;
using EDMCreation.Wpf.Views.Dialogs;
using EDMCreation.Core.ViewModels.Dialogs;

namespace EDMCreation.Wpf
{
    public partial class App : MvxApplication
    {
        protected override void RegisterSetup()
        {
            this.RegisterSetupType<Setup>();            
        }

        private void MvxApplication_Startup(object sender, System.Windows.StartupEventArgs e)
        {

        }
    }
}
