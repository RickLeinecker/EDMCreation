using EDMCreation.Core.Utilities;
using EDMCreation.Core.ViewModels.Dialogs;
using System;
using System.Collections.Generic;
using System.Text;

namespace EDMCreation.Core.Services.Interfaces
{
    public interface IDialogService
    {
        void Register<TViewModel, TView>() where TViewModel : IDialogRequestClose
                                           where TView : IDialog;
        bool? ShowDialog<TViewModel>(TViewModel dialogViewModel) where TViewModel : IDialogRequestClose;
    }
}
