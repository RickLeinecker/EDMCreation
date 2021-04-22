using MvvmCross.Commands;
using System;
using System.Threading.Tasks;
using System.Windows.Input;

namespace EDMCreation.Core.ViewModels.Dialogs
{
    public class BaseDialogViewModel : IDialogRequestClose
    {
        public event EventHandler<DialogCloseRequestedEventArgs> CloseRequested;
        public string Message { get; }
        public MvxAsyncCommand OkCommand { get; }
        public MvxAsyncCommand CancelCommand { get; }
        public BaseDialogViewModel(string message)
        {
            Message = message;
            OkCommand = new MvxAsyncCommand(Ok);
            CancelCommand = new MvxAsyncCommand(Cancel);
        }

        protected virtual async Task Ok()
        {
            CloseRequested?.Invoke(this, new DialogCloseRequestedEventArgs(true));
        }

        protected virtual async Task Cancel()
        {
            CloseRequested?.Invoke(this, new DialogCloseRequestedEventArgs(false));
        }
    }
}
