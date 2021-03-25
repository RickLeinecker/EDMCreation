using EDMCreation.Wpf.ValueConverters;
using MvvmCross.Converters;
using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Data;

namespace EDMCreation.Wpf.ValueConverters
{
    public class IntegerToGenNumberValueConverter : BaseValueConverter<int, string>, IValueConverter
    {
        protected override string Convert(int value, Type TargetType, object parameter, System.Globalization.CultureInfo cultureInfo)
        {
            if (value < 0)
                return "";
            else
                return $"Gen {value}";
        }
    }
}
