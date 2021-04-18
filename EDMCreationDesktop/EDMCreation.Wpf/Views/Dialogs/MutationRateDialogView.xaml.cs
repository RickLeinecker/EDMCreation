using EDMCreation.Core.Utilities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace EDMCreation.Wpf.Views.Dialogs
{
    /// <summary>
    /// Interaction logic for MutationRateDialogView.xaml
    /// </summary>
    public partial class MutationRateDialogView : Window, IDialog
    {
        public string ConfirmText { get; set; }
        public string CancelText { get; set; }

        public Button ConfirmButton { get; set; }
        public Button CancelButton { get; set; }

        public MutationRateDialogView()
        {
            ConfirmText = "Confirm";
            CancelText = "Cancel";
            InitializeComponent();
        }

        protected override void OnActivated(EventArgs e)
        {
            base.OnActivated(e);

            ConfirmButton = FindName("confirmButton") as Button;
            CancelButton = FindName("cancelButton") as Button;

            ConfirmButton.Content = ConfirmText;
            CancelButton.Content = CancelText;
        }
    }
}
