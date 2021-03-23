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
using EDMCreation.Core.ViewModels;
using Microsoft.Win32;
using MvvmCross.Platforms.Wpf.Views;

namespace EDMCreation.Wpf.Views
{
    /// <summary>
    /// Interaction logic for LoadDataView.xaml
    /// </summary>
    public partial class LoadDataView : MvxWpfView
    {
        public LoadDataView()
        {
            InitializeComponent();
        }

        private void OnOpenDialogButton_Click(object sender, RoutedEventArgs e)
        {
            var dialog = new OpenFileDialog();
            bool? result = dialog.ShowDialog();
            if (result == true)
            {
                var viewModel = (LoadDataViewModel)DataContext;
                viewModel.HandleFileCommand.Execute(dialog.FileName);
            }
        }
    }
}
