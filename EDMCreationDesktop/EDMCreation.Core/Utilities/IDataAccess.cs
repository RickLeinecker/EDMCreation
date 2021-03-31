using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text;
using System.IO;

namespace EDMCreation.Core.Utilities
{
    // generic database access interface to allow for scalability in the event we change our database
    public interface IDataAccess
    {
        Task<Stream> LoadTrainingFile();
        Task<bool> StoreData<T>(T data);
        Task<bool> UpdateData<T>(T data);
    }
}
