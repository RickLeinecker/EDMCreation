using Melanchall.DryWetMidi.Devices;
using Melanchall.DryWetMidi.Interaction;
using System;
using System.Threading.Tasks;

namespace EDMCreation.Core.Utilities
{
    public interface IMidiPlayer : IDisposable
    {
        string MidiFilePath { get; }
        bool IsAtStart { get; }
        bool IsPlaying { get; }
        event EventHandler PlaybackStarted;
        event EventHandler PlaybackPaused;
        event EventHandler PlaybackEnded;
        event EventHandler PlaybackStopped;
        event EventHandler TimeSet;
        ITimeSpan Duration { get; }
        ITimeSpan CurrentTime { get; set; }
        void Play();
        void Stop();
        void Pause();
        void AddToPlaybackWatcher();
        void RemoveFromPlaybackWatcher();
    }
}