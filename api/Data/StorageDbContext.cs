using Microsoft.EntityFrameworkCore;
using api.Models.Domain;

namespace api.Data
{
    public class StorageDbContext: DbContext
    {
        public StorageDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Photo> Photos { get; set; }
    }
}