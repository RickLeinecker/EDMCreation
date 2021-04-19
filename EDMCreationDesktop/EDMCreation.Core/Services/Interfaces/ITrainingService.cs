using EDMCreation.Core.Models;
using System.Collections.Generic;

namespace EDMCreation.Core.Services.Interfaces
{
    public interface ITrainingService
    {
        List<string> GenerateSongs(List<string> selectedSongPaths, int genNum, int totalGens, double mutationRate);
        List<string> GenerateFirstSongs(double mutationRate);
        void Initialize(SessionModel session);
        void DestroyGeneration(int genNum);
        string SessionsPath { get; }
    }
}