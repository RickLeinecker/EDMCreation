using EDMCreation.Core.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace EDMCreation.Wpf.Views.Dialogs
{
    public class YesNoDialogView : BaseDialogView, IDialog
    {
        public YesNoDialogView()
        {
            ConfirmText = "Yes";
            CancelText = "No";
        }
    }
}
