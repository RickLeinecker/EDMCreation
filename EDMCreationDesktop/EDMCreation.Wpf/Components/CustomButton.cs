using EDMCreation.Wpf.ValueConverters;
using MaterialDesignThemes.Wpf;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;

namespace EDMCreation.Wpf.Components
{
    public class CustomButton : Control
    {
        public string Size
        {
            get { return (string)GetValue(SizeProperty); }
            set { SetValue(SizeProperty, value); }
        }
        public string IconMargin
        {
            get { return (string)GetValue(IconMarginProperty); }
            set { SetValue(IconMarginProperty, value); } 
        }
        public string IconKind
        {
            get { return (string)GetValue(IconKindProperty); }
            set { SetValue(IconKindProperty, value); }
        }
        public string IconSize
        {
            get { return (string)GetValue(IconSizeProperty); }
            set { SetValue(IconSizeProperty, value); }
        }
        public string Command
        {
            get { return (string)GetValue(CommandProperty); }
            set { SetValue(CommandProperty, value); }
        }
        public string Text
        {
            get { return (string)GetValue(TextProperty); }
            set { SetValue(TextProperty, value); }
        }

        public static DependencyProperty SizeProperty = DependencyProperty.Register("Size", typeof(string), typeof(CustomButton), new PropertyMetadata("auto"));
        public static DependencyProperty IconMarginProperty = DependencyProperty.Register("IconMargin", typeof(string), typeof(CustomButton), new PropertyMetadata("0 0 0 0"));
        public static DependencyProperty IconKindProperty = DependencyProperty.Register("IconKind", typeof(string), typeof(CustomButton), new PropertyMetadata("CursorDefault"));
        public static DependencyProperty IconSizeProperty = DependencyProperty.Register("IconSize", typeof(string), typeof(CustomButton), new PropertyMetadata("30"));
        public static DependencyProperty CommandProperty = DependencyProperty.Register("Command", typeof(string), typeof(CustomButton), new PropertyMetadata(""));
        public static DependencyProperty TextProperty = DependencyProperty.Register("Text", typeof(string), typeof(CustomButton), new PropertyMetadata(""));

        static CustomButton()
        {
            DefaultStyleKeyProperty.OverrideMetadata(typeof(CustomButton), new FrameworkPropertyMetadata(typeof(CustomButton)));
        }
    }

    internal class IconKindValueConverter : BaseValueConverter<string, PackIconKind>, IValueConverter
    {
        protected override PackIconKind Convert(string value, Type targetType, object parameter, CultureInfo culture)
        {
            if (Enum.TryParse((string)value, out PackIconKind icon))
            {
                return icon;
            }
            else
            {
                return 0;
            }
        }
    }
    internal class StringToThicknessConverter : BaseValueConverter<string, Thickness>, IValueConverter
    {
        protected override Thickness Convert(string value, Type targetType, object parameter, CultureInfo culture)
        {
            ThicknessConverter tc = new ThicknessConverter();
            return (Thickness)tc.ConvertFromString(value);
        }
    }

    internal class StringToSizeConverter : BaseValueConverter<string, double>, IValueConverter
    {
        protected override double Convert(string value, Type targetType, object parameter, CultureInfo culture)
        {
            if (String.IsNullOrEmpty(value) || value == "auto")
                return Double.NaN;

            return System.Convert.ToDouble(value);
        }
    }
}
