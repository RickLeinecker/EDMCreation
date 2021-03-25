using System;
using System.Collections.Generic;
using System.Text;

namespace EDMCreation.Core.ViewModels.Dialogs
{
    public class DialogCloseRequestedEventArgs : EventArgs
    {
        public DialogCloseRequestedEventArgs(bool? dialogResult)
        {
            DialogResult = dialogResult;
        }

        public bool? DialogResult { get; }
    }
}
