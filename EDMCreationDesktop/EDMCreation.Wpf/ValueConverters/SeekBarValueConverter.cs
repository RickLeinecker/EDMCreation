using Melanchall.DryWetMidi.Interaction;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Windows.Data;

namespace EDMCreation.Wpf.ValueConverters
{
    public class SeekBarValueConverter : BaseValueConverter<ITimeSpan, double>, IValueConverter
    {
        protected override double Convert(ITimeSpan value, Type TargetType, object parameter, System.Globalization.CultureInfo cultureInfo)
        {
            return (double)TimeConverter.ConvertFrom(value, TempoMap.Default);
        }

        protected override ITimeSpan ConvertBack(double value, Type targetType, object parameter, CultureInfo culture)
        {
            return TimeConverter.ConvertTo((long)value, TimeSpanType.Midi, TempoMap.Default);
        }
    }
}
