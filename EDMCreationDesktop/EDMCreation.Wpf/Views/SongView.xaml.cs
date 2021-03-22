using MvvmCross.Platforms.Wpf.Presenters.Attributes;
using MvvmCross.Platforms.Wpf.Views;
using EDMCreation.Core.ViewModels;

namespace EDMCreation.Wpf.Views
{
    [MvxContentPresentation(StackNavigation = false)]
    public partial class SongView : MvxWpfView
    {
        public SongView()
        {
            InitializeComponent();
        }
    }
}
