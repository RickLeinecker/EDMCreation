using EDMCreation.Core.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.IO;
using Python.Included;
using Python.Runtime;
using EDMCreation.Core.ViewModels;


namespace EDMCreation.Core.Services
{
    public class TrainingService : ITrainingService
    {
        public List<string> GenerateSongs(List<string> inputSongs)
        {
            // edit base folder here using the filepaths passed
            // 
            Installer.InstallPath = Path.GetFullPath(".");
            PythonEngine.Initialize();
            dynamic sys = PythonEngine.ImportModule("sys");
            dynamic os = PythonEngine.ImportModule("os");

            dynamic generate = Py.Import("python.generate");
            generate.generate_mutations(generate.create_base());


            List<string> songs  = new List<string>(Directory.GetFiles("python\\output"));

            return songs;
        }

    }
}
