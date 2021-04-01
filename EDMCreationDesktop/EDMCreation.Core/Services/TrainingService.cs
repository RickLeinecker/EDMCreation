using EDMCreation.Core.Services.Interfaces;
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

            // using the genPath will ensure the files will always exist at their specified filepaths
            List<string> songs  = new List<string>(Directory.GetFiles(genPath));

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

            // using the genPath will ensure the files will always exist at their specified filepaths
            List<string> songs = new List<string>(Directory.GetFiles(genPath));

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
                
        public void Initialize(string genre)
        {
            // populate base directory with base files
            string absPath = Path.GetFullPath(".");
            string basePath = $"{absPath}\\python\\base";
            string sessionsPath = $"{absPath}\\python\\sessions";
            string outputPath = $"{absPath}\\python\\output";


            Directory.CreateDirectory(basePath);
            Directory.CreateDirectory(sessionsPath);
            Directory.CreateDirectory(outputPath);

            DirectoryInfo sessionsDir = new DirectoryInfo(sessionsPath);
            DirectoryInfo outputDir = new DirectoryInfo(outputPath);

            foreach (DirectoryInfo dir in sessionsDir.GetDirectories())
            {
                dir.Delete(true);
            }
            foreach (FileInfo file in outputDir.GetFiles())
            {
                file.Delete();
            }
        }

        public void DestroyGeneration(int genNum)
        {
            string absPath = Path.GetFullPath(".");
            string sessionsPath = $"{absPath}\\python\\sessions";

            DirectoryInfo sessionsDir = new DirectoryInfo($"{sessionsPath}\\gen{genNum}");

            sessionsDir.Delete(true);
        }
    }
}
