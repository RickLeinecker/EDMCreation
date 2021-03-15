using System;
using System.ComponentModel;
using System.Threading.Tasks;

namespace EDMCreation.Core.Services
{
    public interface IMidiPlayerService : INotifyPropertyChanged
    {
        bool IsPlaying { get; }
        Task PlayAsync(string fileName);
        void PlaybackEnded(object sender, EventArgs e);
        void Stop();
    }
}