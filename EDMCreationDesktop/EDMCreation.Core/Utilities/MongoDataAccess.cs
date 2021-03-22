using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;

namespace EDMCreation.Core.Utilities
{
    public class MongoDataAccess : IDataAccess
    {
        private IMongoDatabase _dataBase;
        public MongoDataAccess(IMongoClient mongoClient)
        {
            _dataBase = mongoClient.GetDatabase("dbname");
        }
        public async Task<List<T>> LoadData<T>(T data)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> StoreData<T>(T data)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateData<T>(T data)
        {
            throw new NotImplementedException();
        }
    }
}
