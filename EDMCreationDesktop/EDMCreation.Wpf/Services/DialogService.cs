using EDMCreation.Core.Services.Interfaces;
using EDMCreation.Core.Utilities;
using EDMCreation.Core.ViewModels.Dialogs;
using EDMCreation.Wpf.Views.Dialogs;
using System;
using System.Collections.Generic;
using System.Text;

namespace EDMCreation.Wpf.Services
{
    public class DialogService : IDialogService
    {
        public IDictionary<Type, Type> Mappings { get; }
        public DialogService()
        {
            Mappings = new Dictionary<Type, Type>();
        }
        public void Register<TViewModel, TView>() where TViewModel : IDialogRequestClose
                                                  where TView : IDialog
        {
            if (Mappings.ContainsKey(typeof(TViewModel)))
            {
                throw new ArgumentException($"Type {typeof(TViewModel)} is already mapped to type {typeof(TView)}");
            }

            Mappings.Add(typeof(TViewModel), typeof(TView));
        }

        public bool? ShowDialog<TViewModel>(TViewModel dialogViewModel) where TViewModel : IDialogRequestClose
        {
            Type viewType = Mappings[typeof(TViewModel)];
            IDialog dialog = (IDialog)Activator.CreateInstance(viewType);
            void handler(object sender, DialogCloseRequestedEventArgs e)
            {
                dialogViewModel.CloseRequested -= handler;

                if (e.DialogResult.HasValue)
                {
                    dialog.DialogResult = e.DialogResult;
                }
                else
                {
                    dialog.Close();
                }
            }

            dialogViewModel.CloseRequested += handler;
            dialog.DataContext = dialogViewModel;

            return dialog.ShowDialog();
        }
    }
}
