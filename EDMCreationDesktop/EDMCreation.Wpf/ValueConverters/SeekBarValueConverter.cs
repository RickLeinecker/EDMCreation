using Melanchall.DryWetMidi.Interaction;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Windows.Data;

namespace EDMCreation.Wpf.ValueConverters
{
    public class SeekBarValueConverter : BaseValueConverter<ITimeSpan, long>, IValueConverter
    {
        protected override long Convert(ITimeSpan value, Type TargetType, object parameter, System.Globalization.CultureInfo cultureInfo)
        {
            return TimeConverter.ConvertFrom(value, TempoMap.Default);
        }

        protected override ITimeSpan ConvertBack(long value, Type targetType, object parameter, CultureInfo culture)
        {
            return TimeConverter.ConvertTo(value, TimeSpanType.Midi, TempoMap.Default);
        }
    }
}
