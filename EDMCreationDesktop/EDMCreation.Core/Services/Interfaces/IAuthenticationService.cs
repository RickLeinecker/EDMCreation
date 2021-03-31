using EDMCreation.Core.ViewModels;
using System.Threading.Tasks;
using EDMCreation.Core.Models;

namespace EDMCreation.Core.Services.Interfaces
{
    public interface IAuthenticationService
    {
        string LoginToken { get; }
        bool IsAuthenticated { get; }
        Task<bool> Login(UserModel user);
    }
}