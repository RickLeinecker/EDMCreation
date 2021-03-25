using System;
using System.Collections.Generic;
using System.Text;

namespace EDMCreation.Core.Utilities
{
    public interface IDialog
    {
        object DataContext { get; set; }
        bool? DialogResult { get; set; }
        void Close();
        bool? ShowDialog();
    }
}
