using MvvmCross.Commands;
using System;
using System.Windows.Input;

namespace EDMCreation.Core.ViewModels.Dialogs
{
    public class BaseDialogViewModel : IDialogRequestClose
    {
        public event EventHandler<DialogCloseRequestedEventArgs> CloseRequested;
        public string Message { get; }
        public MvxCommand OkCommand { get; }
        public MvxCommand CancelCommand { get; }
        public BaseDialogViewModel(string message)
        {
            Message = message;
            OkCommand = new MvxCommand(() => CloseRequested?.Invoke(this, new DialogCloseRequestedEventArgs(true)));
            CancelCommand = new MvxCommand(() => CloseRequested?.Invoke(this, new DialogCloseRequestedEventArgs(false)));
        }
    }
}
