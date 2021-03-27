using EDMCreation.Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace EDMCreation.Core.Services.Interfaces
{
    public interface IGenreService
    {
         List<GenreModel> Genres { get; }
    }
}
