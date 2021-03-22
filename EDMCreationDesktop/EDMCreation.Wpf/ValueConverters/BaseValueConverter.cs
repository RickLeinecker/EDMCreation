using MvvmCross.Converters;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Windows.Data;

namespace EDMCreation.Wpf.ValueConverters
{
    public abstract class BaseValueConverter : MvxValueConverter, IValueConverter
    {

    }

    public abstract class BaseValueConverter<TFrom, TTo> : MvxValueConverter<TFrom, TTo>, IMvxValueConverter
    {
       
    }

    public abstract class BaseValueConverter<TFrom> : MvxValueConverter<TFrom>, IMvxValueConverter
    {
       
    }
}
