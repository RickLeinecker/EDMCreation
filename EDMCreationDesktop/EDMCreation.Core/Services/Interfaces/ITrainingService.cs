using System.Collections.Generic;

namespace EDMCreation.Core.Services.Interfaces
{
    public interface ITrainingService
    {
        List<string> GenerateSongs(List<string> selectedSongPaths, int genNum, int totalGens, double mutationRate);
        List<string> GenerateFirstSongs(double mutationRate);
        void Initialize(string genre);
        void DestroyGeneration(int genNum);

    }
}