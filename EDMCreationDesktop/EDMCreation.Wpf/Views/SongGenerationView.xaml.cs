using MvvmCross.Platforms.Wpf.Views;
using MvvmCross.Platforms.Wpf.Presenters.Attributes;
using EDMCreation.Core.ViewModels;
using Microsoft.Win32;
using System.IO;
using EDMCreation.Core.Models;
using EDMCreation.Core.Utilities;
using System.IO.Compression;

namespace EDMCreation.Wpf.Views
{
    [MvxContentPresentation(StackNavigation = false)]
    public partial class SongGenerationView : MvxWpfView
    {
        public SongGenerationView()
        {
            InitializeComponent();
        }

        // save session in an uncompressed zip file, but with custom .edm extension
        private void OnSaveButton_Click(object sender, System.Windows.RoutedEventArgs e)
        {
            var vm = (SongGenerationViewModel)DataContext;
            var compLvl = CompressionLevel.NoCompression;
            string sessionPath = vm.TrainingService.SessionsPath;
            SessionModel session = vm.Session;
            
            SaveFileDialog dialog = new SaveFileDialog
            {
                Filter = "EDM-Session files (*.edm)|*.edm",
                FilterIndex = 1,
                FileName = $"{session.Genre}_EDM_Session",
                RestoreDirectory = true
            };

            if (dialog.ShowDialog() == true)
            {
                string zipPath = dialog.FileName;
                string fileName = Path.GetFileNameWithoutExtension(dialog.FileName);


                File.Delete(zipPath);

                ZipFile.CreateFromDirectory(sessionPath, zipPath, compLvl, true);
                ZipArchive archive = ZipFile.Open(zipPath, ZipArchiveMode.Update);

                ZipArchiveEntry infoFile = archive.CreateEntry($"{fileName}.info", compLvl);
                StreamWriter writer = new StreamWriter(infoFile.Open());

                // create session_info which is readable for now, but should probably be non-readable
                string[] sessionInfo =
                {
                    $"{session.MutationRate}",
                    $"{session.Key}",
                    $"{session.GenerateBass}",
                    $"{session.BassNoteLength}",
                    $"{session.GenerationMethod}",
                    $"{session.Genre}",
                    $"{session.CurrentGen}",
                    $"{session.TotalGens}"
                };

                foreach(string line in sessionInfo)
                {
                    writer.WriteLine(line);
                }

                writer.Close();
                archive.Dispose();
            }
        }
    }
}
