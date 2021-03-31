using System;
using System.Collections.Generic;
using System.Text;

namespace EDMCreation.Core.ViewModels.Dialogs
{
    public class InformationDialogViewModel : BaseDialogViewModel, IDialogRequestClose
    {
        public InformationDialogViewModel(string message) : base(message)
        {

        }
    }
}
