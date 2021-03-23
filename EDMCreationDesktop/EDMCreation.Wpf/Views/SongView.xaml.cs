using MvvmCross.Platforms.Wpf.Presenters.Attributes;
using MvvmCross.Platforms.Wpf.Views;
using Microsoft.Win32;
using System.IO;
using EDMCreation.Core.ViewModels;
using System;

namespace EDMCreation.Wpf.Views
{
    [MvxContentPresentation(StackNavigation = false)]
    public partial class SongView : MvxWpfView
    {
        public SongView()
        {
            InitializeComponent();
        }

        private void OnSaveButton_Click(object sender, System.Windows.RoutedEventArgs e)
        {
            var viewModel = (SongViewModel)DataContext;
            SaveFileDialog dialog = new SaveFileDialog();

            dialog.Filter = "midi files (*.mid)|*.mid";
            dialog.FilterIndex = 1;
            dialog.FileName = "midifile";
            dialog.RestoreDirectory = true;

            if (dialog.ShowDialog() == true)
            {
                string path = dialog.FileName;
                File.Copy(viewModel.MidiFilePath, path);
            }
        }

    }
}
