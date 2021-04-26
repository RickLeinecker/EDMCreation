using System;
using System.IO;
using System.IO.Compression;

namespace EDMCreation.Core.Models
{
    
    public class TrainingFile
    {
        private readonly double mutationRate;
        public double MutationRate { get { return mutationRate; } }

        private readonly int key;
        public int Key { get { return key; } }

        private readonly bool generateBass;
        public bool GenerateBass { get { return generateBass; } }

        private readonly int bassNoteLength;
        public int BassNoteLength { get { return bassNoteLength; } }

        private readonly GenerationMethod generationMethod;
        public GenerationMethod GenerationMethod { get { return generationMethod; } }

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

            /*  INFO LAYOUT:
             *  
             *  MutationRate
             *  Key
             *  GenerateBass
             *  BassNoteLength
             *  GenerationMethod
             *  Genre
             *  CurrentGen
             *  TotalGens
             */

            StreamReader sr = new StreamReader(infoFile.Open());

            mutationRate = Convert.ToDouble(sr.ReadLine());
            key = Convert.ToInt32(sr.ReadLine());
            generateBass = Convert.ToBoolean(sr.ReadLine());
            bassNoteLength = Convert.ToInt32(sr.ReadLine());
            if (Enum.TryParse(sr.ReadLine(), out generationMethod))
                if (!Enum.IsDefined(typeof(GenerationMethod), generationMethod))
                    generationMethod = GenerationMethod.Mean;
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

            /*  INFO LAYOUT:
             *  
             *  MutationRate
             *  Key
             *  GenerateBass
             *  BassNoteLength
             *  GenerationMethod
             *  Genre
             *  CurrentGen
             *  TotalGens
             */

            StreamReader sr = new StreamReader(infoFile.Open());

            mutationRate = Convert.ToDouble(sr.ReadLine());
            key = Convert.ToInt32(sr.ReadLine());
            generateBass = Convert.ToBoolean(sr.ReadLine());
            bassNoteLength = Convert.ToInt32(sr.ReadLine());
            if (Enum.TryParse(sr.ReadLine(), out generationMethod))
                if (!Enum.IsDefined(typeof(GenerationMethod), generationMethod))
                    generationMethod = GenerationMethod.Mean;
            genre = sr.ReadLine();
            currentGen = Convert.ToInt32(sr.ReadLine());
            totalGens = Convert.ToInt32(sr.ReadLine());

            sr.Close();
        }
    }
}
