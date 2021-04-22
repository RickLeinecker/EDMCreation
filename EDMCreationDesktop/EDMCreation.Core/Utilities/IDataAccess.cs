using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text;
using System.IO;
using System.IO.Compression;
using System.Net.Http;

namespace EDMCreation.Core.Utilities
{
    // generic database access interface to allow for scalability in the event we change our database
    public interface IDataAccess
    {
        Task<ZipArchive> LoadTrainingFile();
        Task<bool> SaveTrainingFile(ByteArrayContent byteArrayContent, string fileName);
    }
}
