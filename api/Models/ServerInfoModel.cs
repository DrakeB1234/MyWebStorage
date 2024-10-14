namespace api.Models
{
    public class ServerInfoModel
    {
        public long? ServerCurrentStorage { get; set; }
        public long? ServerMaxStorage { get; set; }
        public int? StoredFiles { get; set; }
        public float? ServerTemperture { get; set; }
        public DateTime? ServerUptime { get; set; }
    }
}