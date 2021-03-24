using MvvmCross.Platforms.Wpf.Views;
using MvvmCross.Platforms.Wpf.Presenters.Attributes;

namespace EDMCreation.Wpf.Views
{
    [MvxContentPresentation(StackNavigation = false)]
    public partial class SongGenerationView : MvxWpfView
    {
        public SongGenerationView()
        {
            InitializeComponent();
        }
    }
}
