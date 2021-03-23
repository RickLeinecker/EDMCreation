using Melanchall.DryWetMidi.Core;
using Melanchall.DryWetMidi.Devices;
using Melanchall.DryWetMidi.Interaction;
using System;
using System.Threading.Tasks;

namespace EDMCreation.Core.Utilities
{
    public class MidiPlayer : IMidiPlayer
    {
        private static OutputDevice _outputDevice = OutputDevice.GetByName("Microsoft GS Wavetable Synth");
        public static OutputDevice OutputDevice { set { _outputDevice = value; } }

        private MidiFile midiFile;
        private Playback playback;
        private bool reachedEnd = true;
        private string midiFilePath;
        public string MidiFilePath
        {
            get { return midiFilePath; }
        }

        public bool IsPlaying
        {
            get { return playback.IsRunning; }
        }

        public ITimeSpan Duration
        {
            get { return playback.GetDuration(TimeSpanType.Midi); }
        }
        public ITimeSpan CurrentTime
        {
            get { return playback.GetCurrentTime(TimeSpanType.Midi); }
            set 
            {
                if (value != null)
                    playback.MoveToTime(value);
                    
            }
        }

        public event EventHandler PlaybackStarted;
        public event EventHandler PlaybackEnded;
        public event EventHandler PlaybackPaused;

        protected virtual void OnPlaybackStarted(EventArgs e)
        {
            EventHandler handler = PlaybackStarted;
            handler.Invoke(this, e);
        }

        protected virtual void OnPlaybackEnded(EventArgs e)
        {
            EventHandler handler = PlaybackEnded;
            handler.Invoke(this, e);
        }

        protected virtual void OnPlaybackPaused(EventArgs e)
        {
            EventHandler handler = PlaybackPaused;
            handler.Invoke(this, e);
        }

        public MidiPlayer(string midiFilePath)
        {
            this.midiFilePath = midiFilePath;
            midiFile = MidiFile.Read(midiFilePath);

            playback = midiFile.GetPlayback(_outputDevice);

            playback.InterruptNotesOnStop = true;
            playback.Finished += PlaybackFinished;
        }

        public void Play()
        {
            if (reachedEnd)
                playback.MoveToStart();

            playback.Start();
            reachedEnd = false;
            OnPlaybackStarted(new EventArgs());
        }

        public void Stop()
        {
            playback.Stop();
            playback.MoveToStart();
            OnPlaybackEnded(new EventArgs());
        }

        public void Pause()
        {
            playback.Stop();
            OnPlaybackPaused(new EventArgs());
        }

        //more to be done here
        public void Destroy()
        {
            PlaybackCurrentTimeWatcher.Instance.RemovePlayback(playback);
        }

        private void PlaybackFinished(object sender, EventArgs e)
        {
            reachedEnd = true;
            OnPlaybackEnded(new EventArgs());
        }

        public void AddToPlaybackWatcher()
        {
            PlaybackCurrentTimeWatcher.Instance.AddPlayback(playback, TimeSpanType.Midi);
        }

        public void RemoveFromPlaybackWatcher()
        {
            PlaybackCurrentTimeWatcher.Instance.RemovePlayback(playback);
        }
    }
}
