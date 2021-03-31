using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace EDMCreation.Core.Services.Interfaces
{
    public interface IHttpClientService
    {
        HttpClient Client { get; }
    }
}
