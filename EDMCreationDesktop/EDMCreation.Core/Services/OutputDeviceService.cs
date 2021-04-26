using EDMCreation.Core.Services.Interfaces;
using Melanchall.DryWetMidi.Devices;
using System;
using System.Collections.Generic;
using System.Text;

namespace EDMCreation.Core.Services
{
    public class OutputDeviceService : IOutputDeviceService
    {
        private static OutputDevice _outputDevice;
        public OutputDevice OutputDevice { get { return _outputDevice; } }
        public OutputDeviceService()
        {
            try
            {
                _outputDevice = OutputDevice.GetByName("VirtualMIDISynth #1");
            }
            catch (ArgumentException e)
            {
                _outputDevice = OutputDevice.GetByName("Microsoft GS Wavetable Synth");
            }
        }
    }
}