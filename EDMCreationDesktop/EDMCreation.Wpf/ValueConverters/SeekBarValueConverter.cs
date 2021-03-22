using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Windows.Data;

namespace EDMCreation.Wpf.ValueConverters
{
    public class SeekBarValueConverter : BaseValueConverter<float, float>, IValueConverter
    {
        protected override float Convert(float value, Type TargetType, object parameter, System.Globalization.CultureInfo cultureInfo)
        {
            return value * 10;
        }

        protected override float ConvertBack(float value, Type targetType, object parameter, CultureInfo culture)
        {
            return value / 10;
        }
    }
}
