using System;
using System.Collections.Generic;
using System.Text;

namespace EDMCreation.Core.Models
{
    public class TrainingFileModel : ITrainingFileModel
    {
        public string File { get; set; }
        public string UploadedOn { get; set; }
        public string LastModified { get; set; }
    }
}
