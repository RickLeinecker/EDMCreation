using System;
using System.Collections.Generic;
using System.Text;

namespace EDMCreation.Core.ViewModels.Dialogs
{
    public interface IDialogRequestClose
    {
        event EventHandler<DialogCloseRequestedEventArgs> CloseRequested;
    }
}
