using System.Collections.Generic;

namespace EDMCreation.Core.Services.Interfaces
{
    public interface ITrainingService
    {
        List<string> GenerateSongs(List<string> selectedSongPaths, int genNum, int totalGens);
        List<string> GenerateFirstSongs();
        List<string> UpdateGeneration(int genNum);
        void Initialize(string genre);
    }
}