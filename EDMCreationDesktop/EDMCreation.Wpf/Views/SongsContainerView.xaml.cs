using MvvmCross.Platforms.Wpf.Presenters.Attributes;
using MvvmCross.Platforms.Wpf.Views;
using MvvmCross.Presenters;
using MvvmCross.Presenters.Attributes;
using MvvmCross.ViewModels;

namespace EDMCreation.Wpf.Views
{
    [MvxContentPresentation(StackNavigation = false)]
    public partial class SongsContainerView : MvxWpfView
    {
        public SongsContainerView()
        {
            InitializeComponent();
        }
    }
}
