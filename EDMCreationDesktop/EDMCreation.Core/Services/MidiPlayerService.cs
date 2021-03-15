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
        private static Playback _playback;
        private static OutputDevice _outputDevice;

        public event PropertyChangedEventHandler PropertyChanged;

        public bool IsPlaying { get { return (_playback == null) ? false : _playback.IsRunning; } }

        public async Task PlayAsync(string fileName)
        {
            Stop();

            var midiFile = MidiFile.Read(fileName);
            _outputDevice = OutputDevice.GetByName("Microsoft GS Wavetable Synth");
            _playback = midiFile.GetPlayback(_outputDevice);
            _playback.Finished += PlaybackEnded;
            _playback.Stopped += PlaybackEnded;


            await Task.Run(() =>
            {
                _playback.Start();
            });

            OnPropertyChanged("IsPlaying");
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
            OnPropertyChanged("IsPlaying");
        }

        protected void OnPropertyChanged([CallerMemberName] string name = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }
    }
}
