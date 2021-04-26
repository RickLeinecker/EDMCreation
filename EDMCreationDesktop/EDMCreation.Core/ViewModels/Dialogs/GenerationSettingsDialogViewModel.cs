using EDMCreation.Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace EDMCreation.Core.ViewModels.Dialogs
{
    public class GenerationSettingsDialogViewModel : BaseDialogViewModel, IDialogRequestClose
    {
        public double MutationRate { get; set; }
        public int Key { get; set; }
        public bool GenerateBass { get; set; }
        public int BassNoteLength { get { return lengthValues[BassNoteLengthSelection]; } }
        public int BassNoteLengthSelection { get; set; }
        public int GenerationMethod { get; set; }
        private List<int> lengthValues = new List<int>();
        public GenerationSettingsDialogViewModel(string message, SessionModel session) : base(message)
        {

            lengthValues.Add(2);
            lengthValues.Add(4);
            lengthValues.Add(8);

            MutationRate = session.MutationRate;
            Key = session.Key;
            GenerateBass = session.GenerateBass;
            BassNoteLengthSelection = lengthValues.IndexOf(session.BassNoteLength);
            GenerationMethod = (int)session.GenerationMethod;
        }
    }
}
