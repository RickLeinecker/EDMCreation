using EDMCreation.Core.Models;
using EDMCreation.Core.Utilities;
using EDMCreation.Core.ViewModels;
using System;
using System.Threading.Tasks;

namespace EDMCreation.Core.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private IDataAccess _dataAccess;

        public AuthenticationService(IDataAccess dataAccess)
        {
            _dataAccess = dataAccess;
        }
        public async Task Register(string email, string username, string password, string confirmPassword)
        {
            bool success = false;

            if (password == confirmPassword)
            {
                IUserModel user = new UserModel()
                {
                    Email = email,
                    Username = username,
                    Password = password
                };
            }

            await _dataAccess.LoadData<UserModel>(new UserModel());
        }

        public async Task<IUserModel> Login(LoginViewModel user)
        {
            throw new NotImplementedException();
        }

        public Task<bool> IsAuthenticated()
        {
            throw new NotImplementedException();
        }
    }
}
