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
        public string Genre { get; }
        public int CurrentGen { get; set; }
        public int TotalGens { get; set; }
        public List<SongsContainerViewModel> SongsContainers { get; set; }
        public List<SongViewModel> CurrentSongPanels { get; set; }
        public List<string> CurrentSongFiles { get; set; }
        public double MutationRate { get; set; }
        public MvxViewModel CurrentContainer { get; set; }

        // creating new session
        public SessionModel(string genre)
        {
            MutationRate = 0.5;
            Genre = genre;
            SongsContainers = new List<SongsContainerViewModel>();
            CurrentSongPanels = new List<SongViewModel>();
            TotalGens = 0;
            CurrentGen = -1;
            CurrentContainer = new EmptyContainerViewModel();

            CurrentSongFiles = new List<string>();
        }

        // loading session
        public SessionModel(Stream trainingFile)
        {
            // ????
            // genre = trainingfile.getgenre
        }

        // public static convertToTrainingFile() 
    }
}
