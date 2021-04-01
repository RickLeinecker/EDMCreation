using System.Collections.Generic;

namespace EDMCreation.Core.Services.Interfaces
{
    public interface ITrainingService
    {
        List<string> GenerateSongs(List<string> selectedSongPaths, int genNum, int totalGens);
        List<string> GenerateFirstSongs();
        void Initialize(string genre);
        void DestroyGeneration(int genNum);

    }
}