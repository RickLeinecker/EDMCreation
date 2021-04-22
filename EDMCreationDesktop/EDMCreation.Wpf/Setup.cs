using MvvmCross.Platforms.Wpf.Core;
using MvvmCross;
using EDMCreation.Core.Services.Interfaces;
using EDMCreation.Wpf.Services;
using EDMCreation.Core.ViewModels.Dialogs;
using EDMCreation.Wpf.Views.Dialogs;
using MvvmCross.IoC;

namespace EDMCreation.Wpf
{
    public class Setup : MvxWpfSetup<Core.App>
    {
        protected override void InitializeFirstChance()
        {
            base.InitializeFirstChance();

            Mvx.IoCProvider.ConstructAndRegisterSingleton<IDialogService, DialogService>();
            IDialogService dialogService = Mvx.IoCProvider.Resolve<IDialogService>();
            dialogService.Register<YesNoDialogViewModel, YesNoDialogView>();
            dialogService.Register<InformationDialogViewModel, InformationDialogView>();
            dialogService.Register<MutationRateDialogViewModel, MutationRateDialogView>();
            dialogService.Register<LoginDialogViewModel, LoginDialogView>();
        }
    }
}