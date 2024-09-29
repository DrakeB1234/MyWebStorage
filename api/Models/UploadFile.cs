using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class UploadFile
    {
        public string uploadPath { get; set; }
        public IList<IFormFile> files { get; set; }
    }
}