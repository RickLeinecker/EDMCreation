using EDMCreation.Core.Utilities;
using MvvmCross;
using System;
using System.Collections.Generic;
using System.Text;

namespace EDMCreation.Core.Services
{
    public class MidiPlayerService
    {
        public void CreateMidiPlayerInstance(string midiFilePath)
        {
            IMidiPlayer midiPlayer = Mvx.IoCProvider.Resolve<IMidiPlayer>();
        }
    }
}
