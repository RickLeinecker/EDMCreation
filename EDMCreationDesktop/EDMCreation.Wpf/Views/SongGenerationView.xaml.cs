using MvvmCross.Platforms.Wpf.Views;
using MvvmCross.Platforms.Wpf.Presenters.Attributes;
using EDMCreation.Core.ViewModels;
using Microsoft.Win32;
using System.IO;
using EDMCreation.Core.Models;
using EDMCreation.Core.Utilities;

namespace EDMCreation.Wpf.Views
{
    [MvxContentPresentation(StackNavigation = false)]
    public partial class SongGenerationView : MvxWpfView
    {
        public SongGenerationView()
        {
            InitializeComponent();
        }

        private void OnSaveButton_Click(object sender, System.Windows.RoutedEventArgs e)
        {
            var vm = (SongGenerationViewModel)DataContext;
            string sessionPath = vm.TrainingService.SessionsPath;
            SessionModel session = vm.Session;
            
            SaveFileDialog dialog = new SaveFileDialog
            {
                Filter = "EDM-Session files (*.edms)|*.edms",
                FilterIndex = 1,
                FileName = $"{session.Genre}-EDM-Session",
                RestoreDirectory = true
            };

            if (dialog.ShowDialog() == true)
            {
                string saveFolder = dialog.FileName;
                string path = $"{saveFolder}\\sessions";
                Directory.CreateDirectory(path);

                CopyDir.Copy(sessionPath, path);

                string name = Path.GetFileNameWithoutExtension(dialog.FileName);

                // create session_info which is readable for now, but should probably be non-readable
                string sessionInfoPath = $"{saveFolder}\\{name}.edm";
                string[] sessionInfo =
                {
                    $"{session.MutationRate}",
                    $"{session.Genre}",
                    $"{session.CurrentGen}",
                    $"{session.TotalGens}"
                };

                File.WriteAllLines(sessionInfoPath, sessionInfo);
            }
        }
    }
}
