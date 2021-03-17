using MvvmCross.Platforms.Wpf.Presenters;
using MvvmCross.ViewModels;
using System;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace EDMCreation.Wpf
{
    internal class CustomPresenter : IMvxWpfViewPresenter
    {
        private ContentControl root;

        public CustomPresenter(ContentControl root)
        {
            this.root = root;
        }

        public void AddPresentationHintHandler<THint>(Func<THint, Task<bool>> action) where THint : MvxPresentationHint
        {
            throw new NotImplementedException();
        }

        public Task<bool> ChangePresentation(MvxPresentationHint hint)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Close(IMvxViewModel viewModel)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Show(MvxViewModelRequest request)
        {
            throw new NotImplementedException();
        }
    }
}