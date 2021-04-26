using EDMCreation.Core.Models;
using System.Collections.Generic;

namespace EDMCreation.Core.Services.Interfaces
{
    public interface ITrainingService
    {
        List<string> GenerateSongs(List<string> selectedSongPaths, SessionModel session);
        List<string> GenerateFirstSongs(SessionModel session);
        void Initialize(SessionModel session);
        void DestroyGeneration(int genNum);
        string SessionsPath { get; }
    }
}