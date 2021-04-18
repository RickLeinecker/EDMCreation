using System;
using System.Collections.Generic;
using System.Text;

namespace EDMCreation.Core.ViewModels.Dialogs
{
    public class MutationRateDialogViewModel : BaseDialogViewModel, IDialogRequestClose
    {
        public double MutationRate { get; set; }
        public MutationRateDialogViewModel(string message, double mutationRate) : base(message)
        {
            MutationRate = mutationRate;
        }
    }
}
