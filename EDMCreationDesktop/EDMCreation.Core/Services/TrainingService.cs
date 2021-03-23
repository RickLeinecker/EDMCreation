using EDMCreation.Core.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace EDMCreation.Core.Services
{
    public class TrainingService : ITrainingService
    {
        public List<string> GenerateSongs(List<string> prevGen)
        {
            var songs = new List<string>()
            {
                @"..\..\..\..\EDMCreation.Core\ViewModels\TestSongs\test.mid",
                @"..\..\..\..\EDMCreation.Core\ViewModels\TestSongs\test2.mid",
                @"..\..\..\..\EDMCreation.Core\ViewModels\TestSongs\test3.mid",
                @"..\..\..\..\EDMCreation.Core\ViewModels\TestSongs\test4.mid",
                @"..\..\..\..\EDMCreation.Core\ViewModels\TestSongs\test5.mid",
                @"..\..\..\..\EDMCreation.Core\ViewModels\TestSongs\test6.mid",
                @"..\..\..\..\EDMCreation.Core\ViewModels\TestSongs\test7.mid",
                @"..\..\..\..\EDMCreation.Core\ViewModels\TestSongs\test8.mid",
                @"..\..\..\..\EDMCreation.Core\ViewModels\TestSongs\test9.mid",
                @"..\..\..\..\EDMCreation.Core\ViewModels\TestSongs\test10.mid"
            };

            return songs;
        }
    }
}
