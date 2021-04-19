using EDMCreation.Core.Utilities;
using EDMCreation.Core.ViewModels;
using MvvmCross.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace EDMCreation.Core.Models
{
    
    public class TrainingFile
    {
        private readonly double mutationRate;
        public double MutationRate { get { return mutationRate; } }

        private readonly string sessionsPath;
        public string SessionsPath { get { return sessionsPath; } }

        private readonly string genre;
        public string Genre { get { return genre; } }

        private readonly int currentGen;
        public int CurrentGen { get { return currentGen; } }

        private readonly int totalGens;
        public int TotalGens { get { return totalGens; } }

        public TrainingFile(string path)
        {
            string sessionInfoPath = path;
            string parent = Directory.GetParent(path).FullName;

            /*  INFO LAYOUT:
             *  
             *  MutationRate
             *  Genre
             *  CurrentGen
             *  TotalGens
             */

            StreamReader sr = new StreamReader(sessionInfoPath);

            mutationRate = Convert.ToDouble(sr.ReadLine());
            genre = sr.ReadLine();
            currentGen = Convert.ToInt32(sr.ReadLine());
            totalGens = Convert.ToInt32(sr.ReadLine());

            sr.Close();

            sessionsPath = $"{parent}\\sessions";
        }
    }
}
