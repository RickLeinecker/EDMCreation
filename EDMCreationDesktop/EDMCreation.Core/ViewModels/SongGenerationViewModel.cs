using MvvmCross.ViewModels;
using MvvmCross.Commands;
using MvvmCross.Navigation;
using Melanchall.DryWetMidi.Core;
using Melanchall.DryWetMidi.Devices;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EDMCreation.Core.ViewModels
{
    public class SongGenerationViewModel :MvxViewModel
    {
        IMvxNavigationService _navigationService;
        private static Playback _playback;
        public SongGenerationViewModel(IMvxNavigationService navigationService)
        {
            _navigationService = navigationService;
            PlayCommand = new MvxAsyncCommand(PlayAsync);
        }

        public MvxAsyncCommand PlayCommand { get; set; }

        public async Task PlayAsync()
        {
            var midiFile = MidiFile.Read(@"C:\Users\jakeg\OneDrive\Desktop\github_repositories\EDMCreation\EDMCreationDesktop\EDMCreation.Core\ViewModels\test.mid");
            var outputDevice = OutputDevice.GetByName("Microsoft GS Wavetable Synth");
            _playback = midiFile.GetPlayback(outputDevice);

            await Task.Run(() =>
            {
                _playback.Start();
                SpinWait.SpinUntil(() => !_playback.IsRunning);
            });

            outputDevice.Dispose();
            _playback.Dispose();
        }

    }
}
