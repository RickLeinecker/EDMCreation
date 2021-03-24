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

        private readonly MidiFile midiFile;
        private readonly Playback playback;
        private bool _reachedEnd = false;
        private bool _isAtStart = true;
        private readonly string midiFilePath;

        public bool IsAtStart
        {
            get { return _isAtStart; }
        }
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
                _reachedEnd = false;
                _isAtStart = false;

                playback.MoveToTime(value);

                if (value.CompareTo(Duration) == 0)
                    _reachedEnd = true;

                if (TimeConverter.ConvertFrom(value, TempoMap.Default) == 0 && !IsPlaying)
                    _isAtStart = true;


                OnTimeSet(new EventArgs());
            }
        }

        public event EventHandler PlaybackStarted;
        public event EventHandler PlaybackEnded;
        public event EventHandler PlaybackPaused;
        public event EventHandler PlaybackStopped;
        public event EventHandler TimeSet;

        protected virtual void OnPlaybackStarted(EventArgs e)
        {
            EventHandler handler = PlaybackStarted;
            handler?.Invoke(this, e);
        }

        protected virtual void OnPlaybackEnded(EventArgs e)
        {
            EventHandler handler = PlaybackEnded;
            handler?.Invoke(this, e);
        }

        protected virtual void OnPlaybackPaused(EventArgs e)
        {
            EventHandler handler = PlaybackPaused;
            handler?.Invoke(this, e);
        }

        protected virtual void OnPlaybackStopped(EventArgs e)
        {
            EventHandler handler = PlaybackStopped;
            handler?.Invoke(this, e);
        }

        protected virtual void OnTimeSet(EventArgs e)
        {
            EventHandler handler = TimeSet;
            handler?.Invoke(this, e);
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
            _isAtStart = false;

            if (_reachedEnd)
                playback.MoveToStart();

            playback.Start();
            _reachedEnd = false;
            OnPlaybackStarted(new EventArgs());
        }

        public void Stop()
        {
            playback.Stop();
            playback.MoveToStart();
            _isAtStart = true;

            EventArgs args = new EventArgs();
            OnPlaybackStopped(args);
            OnPlaybackEnded(args);
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
            _reachedEnd = true;
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
