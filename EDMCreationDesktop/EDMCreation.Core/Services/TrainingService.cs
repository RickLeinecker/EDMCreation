using EDMCreation.Core.Services.Interfaces;
using System.Collections.Generic;

namespace EDMCreation.Core.Services
{
    public class TrainingService : ITrainingService
    {
        public List<string> GenerateSongs(List<string> prevGen)
        {
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

            return songs;
        }

        public void TrainModel()
        {
            
        }
    }
}
