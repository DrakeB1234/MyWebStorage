namespace api.Models.Domain
{
    public class Photo
    {
        public Guid Id { get; set; }
        public string ImagePath { get; set; }
        public string Name { get; set; }
        public DateOnly DateAdded { get; set; }
        public string Folder { get; set; }
        public bool Favorite { get; set; }
    }
}