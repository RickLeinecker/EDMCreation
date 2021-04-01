﻿using EDMCreation.Core.Services.Interfaces;
using System.Collections.Generic;
using System.IO;
using Python.Included;
using Python.Runtime;
using System;
using System.Linq;

namespace EDMCreation.Core.Services
{
    public class TrainingService : ITrainingService
    {
        public List<string> GenerateSongs(List<string> selectedSongPaths, int genNum, int totalGens)
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
            DirectoryInfo sessionsDir = new DirectoryInfo(sessionsPath);

            // if we have gone to a previous gen, we need to overwrite later gens
            if (genNum + 1 < totalGens)
            {
                foreach (DirectoryInfo gen in sessionsDir.GetDirectories())
                {
                    if (gen.Name.CompareTo($"gen{genNum}") >= 0) // delete future generations
                        gen.Delete(true);
                }
            }

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

            Generate();

            // save the output as the next generation
            string genPath = $"{sessionsPath}\\gen{genNum + 1}";
            Directory.CreateDirectory(genPath);

            var outputFiles = Directory.GetFiles(outputPath);

            foreach (string file in outputFiles)
            {
                var filename = Path.GetFileName(file);
                File.Copy(file, Path.Combine(genPath, filename));
            }

            List<string> songs  = new List<string>(Directory.GetFiles(outputPath));

            return songs;
        }

        public List<string> GenerateFirstSongs()
        {
            string absPath = Path.GetFullPath(".");
            string basePath = $"{absPath}\\python\\base";
            string sessionsPath = $"{absPath}\\python\\sessions";
            string outputPath = $"{absPath}\\python\\output";


            Directory.CreateDirectory(basePath);
            Directory.CreateDirectory(sessionsPath);
            Directory.CreateDirectory(outputPath);

            Generate();

            // save the output as the initial generation
            string genPath = $"{sessionsPath}\\gen0";
            Directory.CreateDirectory(genPath);

            var outputFiles = Directory.GetFiles(outputPath);

            foreach (string file in outputFiles)
            {
                var filename = Path.GetFileName(file);
                File.Copy(file, Path.Combine(genPath, filename));
            }

            List<string> songs = new List<string>(Directory.GetFiles(outputPath));

            return songs;
        }

        private void Generate()
        {
            Installer.InstallPath = Path.GetFullPath(".");
            PythonEngine.Initialize();
            dynamic sys = PythonEngine.ImportModule("sys");
            dynamic os = PythonEngine.ImportModule("os");

            dynamic generate = Py.Import("python.generate");
            generate.generate_mutations(generate.create_base());
        }

        public List<string> UpdateGeneration(int genNum)
        {
            string absPath = Path.GetFullPath(".");
            string sessionsPath = $"{absPath}\\python\\sessions";
            string outputPath = $"{absPath}\\python\\output";

            Directory.CreateDirectory(sessionsPath);
            Directory.CreateDirectory(outputPath);

            // clear the output folder
            DirectoryInfo outputDir = new DirectoryInfo(outputPath);
            foreach (FileInfo file in outputDir.GetFiles())
            {
                file.Delete();
            }


            DirectoryInfo sessionsDir = new DirectoryInfo(sessionsPath);
            var directories = sessionsDir.GetDirectories().OrderByDescending(x => x.Name).ToArray();
            var files = directories[genNum].GetFiles();

            // copy each file to the output folder
            foreach (FileInfo f in files)
            {
                var filename = f.Name;
                var path = f.FullName;
                File.Copy(path, Path.Combine(outputPath, filename));
            }

            List<string> songs = new List<string>(Directory.GetFiles(outputPath));
            return songs;
        }

        public void Initialize(string genre)
        {
            // populate base directory with base files

        }
    }
}
