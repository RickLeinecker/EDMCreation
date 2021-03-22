using EDMCreation.Core.Utilities;
using Melanchall.DryWetMidi.Devices;
using Melanchall.DryWetMidi.Interaction;
using MvvmCross.Commands;
using MvvmCross.ViewModels;
using System;
using System.Threading.Tasks;

namespace EDMCreation.Core.ViewModels
{
    public class SongViewModel : MvxViewModel
    {
        public string MidiFile
        {
            get { return _midiPlayer.MidiFilePath; }
        }

        public string PlayPauseIcon
        {
            get { return IsPlaying ? "Pause" : "Play"; }
        }
        public string PlayPauseToolTip
        { 
            get { return IsPlaying ? "Pause" : "Play"; }
        }

        private int _songNumber;
        public int SongNumber
        {
            get { return _songNumber; }
            set { SetProperty(ref _songNumber, value); }
        }

        public bool IsPlaying
        {
            get { return _midiPlayer == null ? false : _midiPlayer.IsPlaying; }
        }

        private bool _hasStarted = false;
        public bool HasStarted
        {
            get { return _hasStarted; }
            set { SetProperty(ref _hasStarted, value); }
        }

        private bool _isSelected;
        public bool IsSelected 
        {
            get { return _isSelected; }
            set 
            { 
                SetProperty(ref _isSelected, value); 
                RaisePropertyChanged(nameof(AddRemoveToolTip));
            }
        }

        public string AddRemoveToolTip
        {
            get { return IsSelected ? "Deselect" : "Select"; }
        }

        public ITimeSpan TotalTime
        {
            get { return _midiPlayer.Duration; }
        }

        public ITimeSpan CurrentTime
        {
            get { return _midiPlayer.CurrentTime; }
            set { _midiPlayer.CurrentTime = value; }            
        }

        // floating point value between 0 and 1
        public float SeekValue
        {
            get { return ConvertToSeekValue(TotalTime, CurrentTime); }
            set 
            {
                CurrentTime = ConvertToCurrentTime(TotalTime, value);
                RaisePropertyChanged(nameof(CurrentTime));
            }
        }

        private IMidiPlayer _midiPlayer;

        public SongViewModel(IMidiPlayer midiPlayer, int songNumber)
        {
            _midiPlayer = midiPlayer;
            _songNumber = songNumber;

            _midiPlayer.PlaybackStarted += OnStarted;
            _midiPlayer.PlaybackEnded += OnEnded;
            _midiPlayer.PlaybackPaused += OnPaused;
            PlaybackCurrentTimeWatcher.Instance.CurrentTimeChanged += OnCurrentTimeChanged;

            PlayPauseCommand = new MvxCommand(PlayPause);
            StopCommand = new MvxCommand(Stop);
        }

        public MvxCommand PlayPauseCommand { get; set; }
        public MvxCommand StopCommand { get; set; }

        public void PlayPause()
        {
            if (IsPlaying)
                Pause();
            else
                Play();
        }

        public void Play() { _midiPlayer.Play(); }
        public void Pause() { _midiPlayer.Pause(); }
        public void Stop() { _midiPlayer.Stop(); }

        private void OnStarted(object sender, EventArgs e)
        {
            _hasStarted = true;
            RaiseAllPropertiesChanged();
        }

        private void OnEnded(object sender, EventArgs e)
        {
            _hasStarted = false;
            RaiseAllPropertiesChanged();
        }

        private void OnPaused(object sender, EventArgs e)
        {
            RaiseAllPropertiesChanged();
        }

        private void OnCurrentTimeChanged(object sender, EventArgs e)
        {
            RaisePropertyChanged(nameof(SeekValue));
        }

        private float ConvertToSeekValue(ITimeSpan totalT, ITimeSpan currentT)
        {
            long total = TimeConverter.ConvertFrom(totalT, TempoMap.Default);
            long current = TimeConverter.ConvertFrom(currentT, TempoMap.Default);

            return (float)current / total;
        }

        private ITimeSpan ConvertToCurrentTime(ITimeSpan totalT, float seekValue)
        {
            return totalT.Multiply(seekValue);
        }

    }

}
