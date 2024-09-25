namespace api.Models
{
    public class AddPhotoRequestDTO
    {
        public string ImagePath { get; set; }
        public string Name { get; set; }
        public DateOnly DateAdded { get; set; }
        public string Folder { get; set; }
        public bool Favorite { get; set; }
    }
}