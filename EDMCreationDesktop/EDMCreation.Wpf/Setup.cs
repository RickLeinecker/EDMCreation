using MvvmCross.Platforms.Wpf.Core;
using MvvmCross.Platforms.Wpf.Presenters;
using MvvmCross.ViewModels;
using System.Windows.Controls;

namespace EDMCreation.Wpf
{
    public class Setup : MvxWpfSetup<Core.App>
    {
        protected override IMvxWpfViewPresenter CreateViewPresenter(ContentControl root)
        {
            return base.CreateViewPresenter(root);
        }
    }
}