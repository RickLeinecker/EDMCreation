using EDMCreation.Core.Services;
using MvvmCross.Commands;
using MvvmCross.ViewModels;
using System;
using System.Threading.Tasks;

namespace EDMCreation.Core.ViewModels
{
    public class SongViewModel : MvxViewModel
    {
        private string _midiFile;
        public string MidiFile
        {
            get { return _midiFile; }
            set { SetProperty(ref _midiFile, value); }
        }

        private int _songNumber;
        public int SongNumber
        {
            get { return _songNumber; }
            set { SetProperty(ref _songNumber, value); }
        }

        public bool IsPlaying
        {
            get { return _midiPlayer == null ? false : _midiPlayer.IsPlaying && _midiPlayer.CurrentFile == _midiFile; }
        }

        private bool _isSelected;
        public bool IsSelected 
        {
            get { return _isSelected; }
            set { SetProperty(ref _isSelected, value); }
        }

        private IMidiPlayerService _midiPlayer;

        public SongViewModel(IMidiPlayerService midiPlayerService)
        {
            _midiPlayer = midiPlayerService;
            PlayCommand = new MvxAsyncCommand(PlayFileAsync);
            StopCommand = new MvxCommand(Stop);
        }

        public MvxAsyncCommand PlayCommand { get; set; }

        public async Task PlayFileAsync()
        {
            await _midiPlayer.PlayAsync(MidiFile);
            _midiPlayer.Playback.Finished += (object sender, EventArgs e) => { RaisePropertyChanged("IsPlaying"); };
            _midiPlayer.Playback.Stopped += (object sender, EventArgs e) => { RaisePropertyChanged("IsPlaying"); };
            await RaisePropertyChanged("IsPlaying");
        }

        public MvxCommand StopCommand { get; set; }

        public void Stop()
        {
            _midiPlayer.Stop();
            RaisePropertyChanged("IsPlaying");
        }

    }

}
