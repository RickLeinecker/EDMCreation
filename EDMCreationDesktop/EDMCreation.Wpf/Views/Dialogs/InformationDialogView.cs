using EDMCreation.Core.Utilities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Controls;

namespace EDMCreation.Wpf.Views.Dialogs
{
    public class InformationDialogView : BaseDialogView, IDialog
    {
        public InformationDialogView()
        {
            CancelText = "Ok";
        }

        protected override void OnActivated(EventArgs e)
        {
            base.OnActivated(e);

            ConfirmButton.Visibility = System.Windows.Visibility.Collapsed;
        }
    }
}
