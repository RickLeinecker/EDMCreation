using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Net;
using System.IO;
using System.Net.Http;
using EDMCreation.Core.Services.Interfaces;

namespace EDMCreation.Core.Utilities
{
    public class MongoDataAccess : IDataAccess
    {
        private readonly HttpClient _client;
        private readonly IAuthenticationService _authService;

        public MongoDataAccess(IHttpClientService clientService, IAuthenticationService authenticationService)
        {
            _authService = authenticationService;
            _client = clientService.Client;
        }

        public async Task<Stream> LoadTrainingFile()
        {
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, "users/trainingdownload");
            request.Headers.Add("Authorization", $"Bearer {_authService.LoginToken}");

            var response = await _client.SendAsync(request);
            Stream trainingFile;

            if (response.IsSuccessStatusCode)
            {
                trainingFile = await response.Content.ReadAsStreamAsync();
                return trainingFile;
            }
            else
                return null;
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
