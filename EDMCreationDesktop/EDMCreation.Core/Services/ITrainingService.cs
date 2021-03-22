using System.Collections.Generic;

namespace EDMCreation.Core.Services
{
    public interface ITrainingService
    {
        List<string> GenerateSongs(List<string> prevGen);

    }
}