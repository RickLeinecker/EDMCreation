using System;
using System.Collections.Generic;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;

namespace EDMCreation.Wpf.Components
{
    public class SongContainer : Control
    {
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
}
