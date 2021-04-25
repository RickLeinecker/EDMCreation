using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace EDMCreation.Wpf.Components
{
    public class NumberBox : TextBox
    {
        public bool AllowDecimals 
        {
            get { return (bool)GetValue(AllowDecimalsProperty); }
            set { SetValue(AllowDecimalsProperty, value); }
        }
        public static DependencyProperty AllowDecimalsProperty = DependencyProperty.Register("AllowDecimals", typeof(bool), typeof(NumberBox));

        private string regexString = "[^0-9.]";

        protected override void OnPreviewTextInput(TextCompositionEventArgs e)
        {
            Regex regex = new Regex(regexString);
            e.Handled = regex.IsMatch(e.Text);
            base.OnPreviewTextInput(e);
        }

        public NumberBox() : base()
        {
            if (!AllowDecimals)
            {
                regexString = "[^0-9]";
            }
            Height = 20;
            Width = 80;
            TextAlignment = System.Windows.TextAlignment.Right;
        }
    }
}
