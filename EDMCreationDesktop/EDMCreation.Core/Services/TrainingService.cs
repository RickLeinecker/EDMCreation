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
        public List<string> GenerateSongs(List<string> prevGen)
        {
<<<<<<< HEAD
            var songs = new List<string>()
            {
                @"..\..\..\..\EDMCreation.Core\ViewModels\TestSongs\10_latin-brazilian-sambareggae_96_beat_4-4.mid",
                @"..\..\..\..\EDMCreation.Core\ViewModels\TestSongs\102_funk_95_beat_4-4.mid",
                @"..\..\..\..\EDMCreation.Core\ViewModels\TestSongs\124_afrocuban-bembe_122_fill_4-4.mid",
                @"..\..\..\..\EDMCreation.Core\ViewModels\TestSongs\159_latin-brazilian-baiao_95_fill_4-4.mid",
                @"..\..\..\..\EDMCreation.Core\ViewModels\TestSongs\168_latin-brazilian-baiao_95_fill_4-4.mid",
                @"..\..\..\..\EDMCreation.Core\ViewModels\TestSongs\169_afrocuban-rhumba_110_fill_4-4.mid",
                @"..\..\..\..\EDMCreation.Core\ViewModels\TestSongs\17_country_114_fill_4-4.mid",
                @"..\..\..\..\EDMCreation.Core\ViewModels\TestSongs\175_afrocuban-rhumba_110_fill_4-4.mid",
                @"..\..\..\..\EDMCreation.Core\ViewModels\TestSongs\19_hiphop_100_fill_4-4.mid",
                @"..\..\..\..\EDMCreation.Core\ViewModels\TestSongs\19_jazz-funk_116_fill_4-4.mid"
            };
=======
            Installer.InstallPath = Path.GetFullPath(".");
            PythonEngine.Initialize();
            dynamic sys = PythonEngine.ImportModule("sys");
            dynamic os = PythonEngine.ImportModule("os");




            dynamic generate = Py.Import("python.generate");
            generate.generate_mutations(generate.create_base());


            List<string> songs  = new List<string>(Directory.GetFiles("python\\output"));
>>>>>>> b6a39cfc1d3deab0130d84847a75a4661206f137

            return songs;
        }

        public void TrainModel()
        {
            
        }
    }
}
