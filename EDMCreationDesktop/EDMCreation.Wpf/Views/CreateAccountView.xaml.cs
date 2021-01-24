using MvvmCross.Platforms.Wpf.Presenters.Attributes;
using MvvmCross.Platforms.Wpf.Views;

namespace EDMCreation.Wpf.Views
{
    [MvxContentPresentation(WindowIdentifier = nameof(LaunchWindow))]
    public partial class CreateAccountView : MvxWpfView
    {
        public CreateAccountView()
        {
            InitializeComponent();
        }
    }
}
