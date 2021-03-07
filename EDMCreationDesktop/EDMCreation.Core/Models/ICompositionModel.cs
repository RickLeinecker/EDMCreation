namespace EDMCreation.Core.Models
{
    public interface ICompositionModel
    {
        string Description { get; set; }
        string File { get; set; }
        string Genre { get; set; }
        string Image { get; set; }
        string LastModified { get; set; }
        int Listens { get; set; }
        string Title { get; set; }
        string UploadedOn { get; set; }
    }
}