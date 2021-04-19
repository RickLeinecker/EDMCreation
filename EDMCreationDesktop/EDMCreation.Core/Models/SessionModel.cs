using EDMCreation.Core.ViewModels;
using MvvmCross.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace EDMCreation.Core.Models
{
    public class SessionModel
    {
        public double MutationRate { get; set; }
        public string Genre { get; }
        public int CurrentGen { get; set; }
        public int TotalGens { get; set; }
        public List<SongsContainerViewModel> SongsContainers { get; set; }
        public List<SongViewModel> CurrentSongPanels { get; set; }
        public List<string> CurrentSongFiles { get; set; }
        public MvxViewModel CurrentContainer { get; set; }
        public string SessionsPath { get; }

        // creating new session
        public SessionModel(string genre)
        {
            MutationRate = 0.5;
            Genre = genre;
            CurrentGen = -1;
            TotalGens = 0;

            SongsContainers = new List<SongsContainerViewModel>();
            CurrentSongFiles = new List<string>();
        }

        // loading session
        public SessionModel(TrainingFile trainingFile)
        {
            SessionsPath = trainingFile.SessionsPath;

            MutationRate = trainingFile.MutationRate;
            Genre = trainingFile.Genre;
            CurrentGen = trainingFile.CurrentGen;
            TotalGens = trainingFile.TotalGens;

            SongsContainers = new List<SongsContainerViewModel>();
            CurrentSongFiles = new List<string>();
        }
    }
}
