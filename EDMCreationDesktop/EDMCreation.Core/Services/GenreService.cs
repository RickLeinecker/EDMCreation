using EDMCreation.Core.Models;
using EDMCreation.Core.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace EDMCreation.Core.Services
{
    public class GenreService : IGenreService
    {
        public List<GenreModel> Genres { get; }
        public GenreService()
        {
            // placeholders right now
            Genres = new List<GenreModel>()
            {

                new GenreModel()
                {
                    Name = "Breakbeat",
                    Icon = "MusicCircle"
                },
                new GenreModel()
                {
                    Name = "Techno",
                    Icon = "MusicCircle"
                },
                new GenreModel()
                {
                    Name = "Dubstep",
                    Icon = "MusicCircle"
                },
                new GenreModel()
                {
                    Name = "Future Bass",
                    Icon = "MusicCircle"
                },
                new GenreModel()
                {
                    Name = "House",
                    Icon = "MusicCircle"
                },
                new GenreModel()
                {
                    Name = "Trap",
                    Icon = "MusicCircle"
                },
                new GenreModel()
                {
                    Name = "Dub",
                    Icon = "MusicCircle"
                },
                new GenreModel()
                {
                    Name = "UK Garage",
                    Icon = "MusicCircle"
                }
            };
        }
    }
}
