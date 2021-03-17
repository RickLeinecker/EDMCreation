using Melanchall.DryWetMidi.Core;
using Melanchall.DryWetMidi.Devices;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace EDMCreation.Core.Services
{
    public class MidiPlayerService : IMidiPlayerService
    {
        private static OutputDevice _outputDevice;
        public event PropertyChangedEventHandler PropertyChanged;

        private static Playback _playback;
        public Playback Playback
        {
            get { return _playback; } 
            set { _playback = value; } 
        }

        private static string _currentFile;
        public string CurrentFile
        {
            get { return _currentFile; } 
            set 
            {
                _currentFile = value;
            }
        }

        public bool IsPlaying 
        { 
            get { return (_playback == null) ? false : _playback.IsRunning; } 
        }

        public async Task PlayAsync(string fileName)
        {
            Stop();

            CurrentFile = fileName;
            var midiFile = MidiFile.Read(fileName);
            _outputDevice = OutputDevice.GetByName("Microsoft GS Wavetable Synth");
            _playback = midiFile.GetPlayback(_outputDevice);
            _playback.Finished += PlaybackEnded;
            _playback.Stopped += PlaybackEnded;


            await Task.Run(() =>
            {
                _playback.Start();
            });

        }

        public void Stop()
        {
            if (_playback != null && _playback.IsRunning)
            {
                _playback.Stop();
            }
        }

        public void PlaybackEnded(object sender, EventArgs e)
        {
            _outputDevice.Dispose();
            _playback.Dispose();
        }

        protected void OnPropertyChanged([CallerMemberName] string name = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }
    }
}
