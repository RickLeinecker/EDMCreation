using System;
using System.IO;
using System.IO.Compression;

namespace EDMCreation.Core.Models
{
    
    public class TrainingFile
    {
        private readonly double mutationRate;
        public double MutationRate { get { return mutationRate; } }

        private readonly string genre;
        public string Genre { get { return genre; } }

        private readonly int currentGen;
        public int CurrentGen { get { return currentGen; } }

        private readonly int totalGens;
        public int TotalGens { get { return totalGens; } }

        private readonly ZipArchive _archive;
        public ZipArchive Archive { get { return _archive; } }

        public TrainingFile(string path)
        {
            /*  INFO LAYOUT:
             *  
             *  MutationRate
             *  Genre
             *  CurrentGen
             *  TotalGens
             */

            _archive = ZipFile.OpenRead(path);

            ZipArchiveEntry infoFile = null;

            foreach (ZipArchiveEntry entry in _archive.Entries)
            {
                if (entry.FullName.EndsWith(".info", StringComparison.OrdinalIgnoreCase))
                    infoFile = entry;
            }

            if (infoFile == null)
            {
                throw new FileNotFoundException();
            }

            StreamReader sr = new StreamReader(infoFile.Open());

            mutationRate = Convert.ToDouble(sr.ReadLine());
            genre = sr.ReadLine();
            currentGen = Convert.ToInt32(sr.ReadLine());
            totalGens = Convert.ToInt32(sr.ReadLine());

            sr.Close();
        }

        public TrainingFile(ZipArchive archive)
        {
            _archive = archive;

            ZipArchiveEntry infoFile = null;

            foreach (ZipArchiveEntry entry in _archive.Entries)
            {
                if (entry.FullName.EndsWith(".info", StringComparison.OrdinalIgnoreCase))
                    infoFile = entry;
            }

            if (infoFile == null)
            {
                throw new FileNotFoundException();
            }

            StreamReader sr = new StreamReader(infoFile.Open());

            mutationRate = Convert.ToDouble(sr.ReadLine());
            genre = sr.ReadLine();
            currentGen = Convert.ToInt32(sr.ReadLine());
            totalGens = Convert.ToInt32(sr.ReadLine());

            sr.Close();
        }
    }
}
