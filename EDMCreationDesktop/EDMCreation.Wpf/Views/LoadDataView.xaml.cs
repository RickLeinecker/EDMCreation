using System.Windows;
using EDMCreation.Core.ViewModels;
using Microsoft.Win32;
using MvvmCross.Platforms.Wpf.Views;

namespace EDMCreation.Wpf.Views
{
    public partial class LoadDataView : MvxWpfView
    {
        public LoadDataView()
        {
            InitializeComponent();
        }

        private void OnOpenDialogButton_Click(object sender, RoutedEventArgs e)
        {
            var dialog = new OpenFileDialog
            {
                Filter = "EDM - Session files(*.edm) | *.edm",
                FilterIndex = 1,
                RestoreDirectory = true
            };

            bool? result = dialog.ShowDialog();
            if (result == true)
            {
                var viewModel = (LoadDataViewModel)DataContext;
                viewModel.HandleFileCommand.Execute(dialog.FileName);
            }
        }
    }
}
