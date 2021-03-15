using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;

namespace EDMCreation.Wpf.Components
{
    public class SongContainer : Control
    {
        public static DependencyProperty IsPlayingProperty = DependencyProperty.Register("IsPlaying", typeof(bool), typeof(SongContainer));
        public bool IsPlaying 
        {
            get { return (bool)GetValue(IsPlayingProperty); }
            set { SetValue(IsPlayingProperty, value); }
        }

        public static DependencyProperty SongNumberProperty = DependencyProperty.Register("SongNumber", typeof(string), typeof(SongContainer));
        public string SongNumber
        {
            get { return (string)GetValue(SongNumberProperty); }
            set { SetValue(SongNumberProperty, value); }
        }

        public static DependencyProperty MidiFileProperty = DependencyProperty.Register("MidiFile", typeof(string), typeof(SongContainer));

        public string MidiFile
        {
            get { return (string)GetValue(MidiFileProperty); }
            set { SetValue(MidiFileProperty, value); }
        }

        static SongContainer()
        {
            DefaultStyleKeyProperty.OverrideMetadata(typeof(SongContainer), new FrameworkPropertyMetadata(typeof(SongContainer)));
        }

    }

    internal class MidiFileToPlayButtonParameterConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return $"Command PlayCommand, CommandParameter={value}";
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }

}
