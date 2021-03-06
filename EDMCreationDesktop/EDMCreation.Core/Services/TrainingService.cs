﻿using EDMCreation.Core.Services.Interfaces;
using System.Collections.Generic;
using System.IO;
using Python.Included;
using Python.Runtime;
using System.IO.Compression;
using EDMCreation.Core.Models;
using EDMCreation.Core.Utilities;
using EDMCreation.Core.ViewModels;
using System;

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
        public List<string> GenerateSongs(List<string> selectedSongPaths, SessionModel session)
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

            Generate(session);

            // save the output as the next generation
            string genPath = $"{sessionsPath}\\gen{session.CurrentGen + 1}";
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

        public List<string> GenerateFirstSongs(SessionModel session)
        {
            string absPath = Path.GetFullPath(".");
            string sessionsPath = $"{absPath}\\python\\sessions";
            string outputPath = $"{absPath}\\python\\output";

            Directory.CreateDirectory(sessionsPath);
            Directory.CreateDirectory(outputPath);

            Generate(session);

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

        private void Generate(SessionModel session)
        {
            Installer.InstallPath = Path.GetFullPath(".");
            
            using (Py.GIL())
            {
                dynamic sys = PythonEngine.ImportModule("sys");
                dynamic os = PythonEngine.ImportModule("os");

                dynamic generate = Py.Import("python.generate");
                generate.generate_mutations(generate.create_base(), N: 10, mutation_rate: session.MutationRate, method: (int)session.GenerationMethod,
                    bassline: session.GenerateBass, key: session.Key, bass_note_length: session.BassNoteLength);
            }
        }
                
        public void Initialize(SessionModel session)
        {
            // populate base directory with base files
            string absPath = Path.GetFullPath(".");
            string pythonPath = $"{absPath}\\python";
            string basePath = $"{pythonPath}\\base";
            string sessionsPath = $"{pythonPath}\\sessions";
            string outputPath = $"{pythonPath}\\output";
            string genrePath = $"{pythonPath}\\genres\\{session.Genre}";

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
                ZipFileExtensions.ExtractToDirectory(session.File.Archive, pythonPath);
                string[] files = Directory.GetFiles(pythonPath);
                foreach (string file in files)
                {
                    if (file.EndsWith(".info", StringComparison.OrdinalIgnoreCase))
                    {
                        File.Delete(file);
                    }
                }

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
