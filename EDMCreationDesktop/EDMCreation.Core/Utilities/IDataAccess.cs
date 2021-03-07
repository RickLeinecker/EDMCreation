using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text;

namespace EDMCreation.Core.Utilities
{
    // generic database access interface to allow for scalability in the event we change our database
    public interface IDataAccess
    {
        Task<List<T>> LoadData<T>(T data);
        Task<bool> StoreData<T>(T data);
        Task<bool> UpdateData<T>(T data);
    }
}
