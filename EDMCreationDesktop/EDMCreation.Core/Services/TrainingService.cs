using EDMCreation.Core.Services.Interfaces;
using System.Collections.Generic;
using System.IO;
using Python.Included;
using Python.Runtime;
using System;
using System.Linq;
using EDMCreation.Core.Models;
using EDMCreation.Core.Utilities;
using EDMCreation.Core.ViewModels;

namespace EDMCreation.Core.Services
{
    public class TrainingService : ITrainingService
    {
        public string SessionsPath
        {
            get
            {
                string absPath = Path.GetFullPath(".");
                string sessionsPath = $"{absPath}\\python\\sessions";
                return sessionsPath;
            }
        }
        public List<string> GenerateSongs(List<string> selectedSongPaths, int genNum, int totalGens, double mutationRate)
        {
            // edit base folder here using the filepaths passed
            string absPath = Path.GetFullPath(".");
            string basePath = $"{absPath}\\python\\base";
            string sessionsPath = $"{absPath}\\python\\sessions";
            string outputPath = $"{absPath}\\python\\output";


            Directory.CreateDirectory(basePath);
            Directory.CreateDirectory(sessionsPath);
            Directory.CreateDirectory(outputPath);

            DirectoryInfo baseDir = new DirectoryInfo(basePath);

            // delete the files in base
            foreach (FileInfo file in baseDir.GetFiles())
            {
                file.Delete();
            }

            // add selected songs to base
            foreach (string s in selectedSongPaths)
            {
                var filename = Path.GetFileName(s);
                File.Copy(s, Path.Combine(basePath, filename));
            }

            Generate(mutationRate);

            // save the output as the next generation
            string genPath = $"{sessionsPath}\\gen{genNum + 1}";
            Directory.CreateDirectory(genPath);

            var outputFiles = Directory.GetFiles(outputPath);

            foreach (string file in outputFiles)
            {
                var filename = Path.GetFileName(file);
                File.Copy(file, Path.Combine(genPath, filename));
            }

            // using the genPath will ensure the files will always exist at their specified filepaths
            List<string> songs  = new List<string>(Directory.GetFiles(genPath));

            return songs;
        }

        public List<string> GenerateFirstSongs(double mutationRate)
        {
            string absPath = Path.GetFullPath(".");
            string sessionsPath = $"{absPath}\\python\\sessions";
            string outputPath = $"{absPath}\\python\\output";

            Directory.CreateDirectory(sessionsPath);
            Directory.CreateDirectory(outputPath);

            Generate(mutationRate);

            var outputFiles = Directory.GetFiles(outputPath);

            // save the output as the initial generation
            string genPath = $"{sessionsPath}\\gen0";
            Directory.CreateDirectory(genPath);

            foreach (string file in outputFiles)
            {
                var filename = Path.GetFileName(file);
                File.Copy(file, Path.Combine(genPath, filename));
            }

            // using the genPath will ensure the files will always exist at their specified filepaths
            List<string> songs = new List<string>(Directory.GetFiles(genPath));

            return songs;
        }

        private void Generate(double mutationRate)
        {
            Installer.InstallPath = Path.GetFullPath(".");
            PythonEngine.Initialize();
            dynamic sys = PythonEngine.ImportModule("sys");
            dynamic os = PythonEngine.ImportModule("os");

            using (Py.GIL())
            {
                dynamic generate = Py.Import("python.generate");
                generate.generate_mutations(generate.create_base(), mutation_rate: mutationRate);
                // (check with nick)
            }
            
        }
                
        public void Initialize(SessionModel session)
        {
            // populate base directory with base files
            string absPath = Path.GetFullPath(".");
            string basePath = $"{absPath}\\python\\base";
            string sessionsPath = $"{absPath}\\python\\sessions";
            string outputPath = $"{absPath}\\python\\output";
            string genrePath = $"{absPath}\\python\\genres\\{session.Genre}";

            Directory.CreateDirectory(basePath);
            Directory.CreateDirectory(sessionsPath);
            Directory.CreateDirectory(outputPath);

            DirectoryInfo sessionsDir = new DirectoryInfo(sessionsPath);
            DirectoryInfo outputDir = new DirectoryInfo(outputPath);
            DirectoryInfo baseDir = new DirectoryInfo(basePath);

            foreach (DirectoryInfo dir in sessionsDir.GetDirectories())
            {
                dir.Delete(true);
            }

            foreach (FileInfo file in outputDir.GetFiles())
            {
                file.Delete();
            }

            foreach (FileInfo file in baseDir.GetFiles())
            {
                file.Delete();
            }

            // if it is a new session
            if (session.TotalGens == 0)
            {
                var genreFiles = Directory.GetFiles(genrePath);

                foreach (string file in genreFiles)
                {
                    var filename = Path.GetFileName(file);
                    File.Copy(file, Path.Combine(basePath, filename));
                }
            }

            // if it is not a new session
            else
            {
                CopyDir.Copy(session.SessionsPath, sessionsPath);

                for (int i = 0; i < session.TotalGens; i++)
                {
                    string genPath = $"{sessionsPath}\\gen{i}";
                    var songs = Directory.GetFiles(genPath);

                    int j = 0;
                    List<SongViewModel> songPanels = new List<SongViewModel>();

                    foreach (string s in songs)
                    {
                        IMidiPlayer midiPlayer = new MidiPlayer(s);
                        SongViewModel songPanel = new SongViewModel(midiPlayer, j);
                        songPanels.Add(songPanel);
                        j++;
                    }

                    session.SongsContainers.Add(new SongsContainerViewModel(i, songPanels));
                }

                session.CurrentContainer = session.SongsContainers[session.CurrentGen];
                session.CurrentSongPanels = session.SongsContainers[session.CurrentGen].Songs;

                foreach (SongViewModel s in session.CurrentSongPanels)
                {
                    session.CurrentSongFiles.Add(s.MidiFilePath);
                    s.StartWatching();
                }
            }
        }

        public void DestroyGeneration(int genNum)
        {
            string absPath = Path.GetFullPath(".");
            string sessionsPath = $"{absPath}\\python\\sessions";

            DirectoryInfo sessionsDir = new DirectoryInfo($"{sessionsPath}\\gen{genNum}");

            if (sessionsDir.Exists)
            {
                sessionsDir.Delete(true);
            }
        }
    }
}
