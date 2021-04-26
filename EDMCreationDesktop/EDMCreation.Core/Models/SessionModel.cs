using EDMCreation.Core.ViewModels;
using MvvmCross.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace EDMCreation.Core.Models
{
    public enum GenerationMethod
    {
        Mean,
        Crossover
    }

    public class SessionModel
    {
        public double MutationRate { get; set; }
        public int Key { get; set; }
        public bool GenerateBass { get; set; }
        public int BassNoteLength { get; set; }
        public GenerationMethod GenerationMethod { get; set; }
        public string Genre { get; }
        public int CurrentGen { get; set; }
        public int TotalGens { get; set; }
        public List<SongsContainerViewModel> SongsContainers { get; set; }
        public List<SongViewModel> CurrentSongPanels { get; set; }
        public List<string> CurrentSongFiles { get; set; }
        public MvxViewModel CurrentContainer { get; set; }
        public TrainingFile File { get; }

        // creating new session
        public SessionModel(string genre)
        {
            MutationRate = 4;
            Key = 36;
            GenerateBass = true;
            BassNoteLength = 4;
            GenerationMethod = GenerationMethod.Mean;
            Genre = genre;
            CurrentGen = -1;
            TotalGens = 0;

            SongsContainers = new List<SongsContainerViewModel>();
            CurrentSongFiles = new List<string>();
        }

        // loading session
        public SessionModel(TrainingFile trainingFile)
        {
            File = trainingFile;

            MutationRate = trainingFile.MutationRate;
            Key = trainingFile.Key;
            GenerateBass = trainingFile.GenerateBass;
            BassNoteLength = trainingFile.BassNoteLength;
            GenerationMethod = trainingFile.GenerationMethod;
            Genre = trainingFile.Genre;
            CurrentGen = trainingFile.CurrentGen;
            TotalGens = trainingFile.TotalGens;

            SongsContainers = new List<SongsContainerViewModel>();
            CurrentSongFiles = new List<string>();
        }
    }
}
