using System;

namespace EDMCreation.Core.Models
{
    public interface IUserModel
    {
        string Username { get; set; }
        string Password { get; set; }
        string FirstName { get; set; }
        string LastName { get; set; }
        string Email { get; set; }
        string Description { get; set; }
        string Image { get; set; }
        DateTime CreatedOn { get; set; }
        DateTime LastModified { get; set; }
    }
}
