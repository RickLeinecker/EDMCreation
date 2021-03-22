namespace EDMCreation.Core.Models
{
    public interface ITrainingFileModel
    {
        string File { get; set; }
        string LastModified { get; set; }
        string UploadedOn { get; set; }
    }
}