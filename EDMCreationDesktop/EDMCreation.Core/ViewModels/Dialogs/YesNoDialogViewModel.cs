using System;
using System.Collections.Generic;
using System.Text;

namespace EDMCreation.Core.ViewModels.Dialogs
{
    public class YesNoDialogViewModel : BaseDialogViewModel, IDialogRequestClose
    {
        public YesNoDialogViewModel(string message) : base(message)
        {

        }
    }
}
