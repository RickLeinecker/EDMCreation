using EDMCreation.Core.ViewModels;
using System.Threading.Tasks;
using EDMCreation.Core.Models;

namespace EDMCreation.Core.Services
{
    public interface IAuthenticationService
    {
        Task Register(string email, string username, string password, string confirmPassword);
        Task<IUserModel> Login(LoginViewModel user);
        Task<bool> IsAuthenticated();
    }
}