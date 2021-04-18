using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Windows.Controls;
using System.Windows.Input;

namespace EDMCreation.Wpf.Components
{
    public class NumberBox : TextBox
    {
        protected override void OnPreviewTextInput(TextCompositionEventArgs e)
        {
            Regex regex = new Regex("[^0-9.]");
            e.Handled = regex.IsMatch(e.Text);
            base.OnPreviewTextInput(e);
        }

        public NumberBox() : base()
        {
            Height = 20;
            Width = 80;
            TextAlignment = System.Windows.TextAlignment.Right;
        }
    }
}
