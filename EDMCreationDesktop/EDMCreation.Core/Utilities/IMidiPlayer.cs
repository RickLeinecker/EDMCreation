using Melanchall.DryWetMidi.Devices;
using Melanchall.DryWetMidi.Interaction;
using System;
using System.Threading.Tasks;

namespace EDMCreation.Core.Utilities
{
    public interface IMidiPlayer
    {
        string MidiFilePath { get; }
        bool IsPlaying { get; }
        event EventHandler PlaybackStarted;
        event EventHandler PlaybackPaused;
        event EventHandler PlaybackEnded;
        ITimeSpan Duration { get; }
        ITimeSpan CurrentTime { get; set; }
        void Play();
        void Stop();
        void Pause();
        void Destroy();
        void AddToPlaybackWatcher();
        void RemoveFromPlaybackWatcher();
    }
}