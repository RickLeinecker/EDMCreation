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
                    Name = "Trap",
                    Icon = "MusicCircle"
                },
                new GenreModel()
                {
                    Name = "Trance",
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
                    Name = "Drum and Bass",
                    Icon = "MusicCircle"
                },
                new GenreModel()
                {
                    Name = "Garage",
                    Icon = "MusicCircle"
                },
                new GenreModel()
                {
                    Name = "Juke House",
                    Icon = "MusicCircle"
                }
            };
        }
    }
}
