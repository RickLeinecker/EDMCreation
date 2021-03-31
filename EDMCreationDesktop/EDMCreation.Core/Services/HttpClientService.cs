using System;
using System.Collections.Generic;
using System.Net.Http;
using EDMCreation.Core.Services.Interfaces;
using System.Text;

namespace EDMCreation.Core.Services
{
    public class HttpClientService : IHttpClientService
    {
        private HttpClient client;
        public HttpClient Client { get { return client; } }
        public HttpClientService()
        {
            client = new HttpClient();
            client.BaseAddress = new Uri("http://localhost:5000/api/");
            client.DefaultRequestHeaders.Add("Accept", "application/json");
        }
    }
}
