using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Net;
using System.IO;
using System.Net.Http;
using EDMCreation.Core.Services.Interfaces;
using System.IO.Compression;

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

        public async Task<ZipArchive> LoadTrainingFile()
        {
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, "users/trainingdownload");
            request.Headers.Add("Authorization", $"Bearer {_authService.LoginToken}");

            var response = await _client.SendAsync(request);
            Stream stream;

            if (response.IsSuccessStatusCode)
            {
                stream = await response.Content.ReadAsStreamAsync();
                var archive = new ZipArchive(stream);
                return archive;
            }
            else
                return null;
        }

        public async Task<bool> SaveTrainingFile(ByteArrayContent byteArrayContent, string fileName)
        {
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, "users/trainingupload");
            request.Headers.Add("Authorization", $"Bearer {_authService.LoginToken}");

            MultipartFormDataContent content = new MultipartFormDataContent();          
            content.Add(byteArrayContent, "file", fileName);

            request.Content = content;

            HttpResponseMessage response = await _client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
