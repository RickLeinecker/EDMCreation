using System;
using System.Collections.Generic;
using System.Text;

namespace EDMCreation.Core.ViewModels.Dialogs
{
    public class GenerationSettingsDialogViewModel : BaseDialogViewModel, IDialogRequestClose
    {
        public double MutationRate { get; set; }
        public GenerationSettingsDialogViewModel(string message, double mutationRate) : base(message)
        {
            MutationRate = mutationRate;
        }
    }
}
