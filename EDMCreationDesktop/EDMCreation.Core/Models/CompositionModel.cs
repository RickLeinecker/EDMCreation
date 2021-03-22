namespace EDMCreation.Core.Models
{
    public class CompositionModel : ICompositionModel
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Genre { get; set; }
        public string Image { get; set; }
        public string File { get; set; }
        public int Listens { get; set; }
        public string UploadedOn { get; set; }
        public string LastModified { get; set; }
    }
}
