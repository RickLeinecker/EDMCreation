using EDMCreation.Core.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Windows;
using System.Windows.Controls;

namespace EDMCreation.Wpf.Components
{
    public class GenreButton : CustomButton
    {
        public GenreModel Genre
        {
            get { return (GenreModel)GetValue(GenreProperty); }
            set { SetValue(GenreProperty, value); }
        }

        public static DependencyProperty GenreProperty = DependencyProperty.Register("Genre", typeof(GenreModel), typeof(CustomButton));

        static GenreButton()
        {

        }

        public override void OnApplyTemplate()
        {
            IconKind = Genre.Icon;
            Text = Genre.Name;
            Command = $"Command ShowSongGenerationViewCommand, CommandParameter=\"{Genre.Name}\"";
            base.OnApplyTemplate();
        }
    }
}
