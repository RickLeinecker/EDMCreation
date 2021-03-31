using EDMCreation.Core.Models;
using EDMCreation.Core.Services.Interfaces;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Diagnostics;

namespace EDMCreation.Core.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private static string loginToken;
        public string LoginToken { get { return loginToken; } }

        private bool isAuthenticated;
        public bool IsAuthenticated { get { return isAuthenticated; } }

        private readonly HttpClient _client;
        public AuthenticationService(IHttpClientService clientService)
        {
            isAuthenticated = false;
            _client = clientService.Client;
        }

        public async Task<bool> Login(UserModel user)
        {
            if (user == null)
            {
                return false;
            }

            var body = new StringContent($"{{\"username\":\"{user.Username}\",\"password\":\"{user.Password}\"}}", Encoding.UTF8, "application/json");

            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, "users/login"){ Content = body };
            request.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

            HttpResponseMessage response;
            try
            {
                response = await _client.SendAsync(request);
            }
            catch
            {
                return false;
            }

            if (response.IsSuccessStatusCode)
            {
                isAuthenticated = true;
                var key = response.Content.ReadAsStringAsync().Result;
                loginToken = JsonConvert.DeserializeObject<LoginResponse>(key).sJWT;
            }

            return isAuthenticated;
        }
    }
    
    internal class LoginResponse
    {
        // ignore naming style conventions
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE1006:Naming Styles", Justification = "<Pending>")]
        public string sJWT { get; set; }
    }
}
