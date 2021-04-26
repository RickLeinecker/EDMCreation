using Melanchall.DryWetMidi.Devices;
using System;
using System.Collections.Generic;
using System.Text;

namespace EDMCreation.Core.Services.Interfaces
{
    public interface IOutputDeviceService
    {
        OutputDevice OutputDevice { get; }
    }
}
