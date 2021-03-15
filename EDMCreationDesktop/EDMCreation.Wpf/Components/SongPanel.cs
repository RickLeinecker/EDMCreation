using System;
using System.Collections.Generic;
using System.Text;
using System.Windows;
using System.Windows.Controls;

namespace EDMCreation.Wpf.Components
{
    class SongPanel : StackPanel
    {
        public static readonly DependencyProperty CurrentFileProperty = DependencyProperty.Register("CurrentFile", typeof(string), typeof(SongPanel));
        public string CurrentFile 
        {
            get { return (string)GetValue(CurrentFileProperty); }
            set { SetValue(CurrentFileProperty, value); }
        }
    }
}
