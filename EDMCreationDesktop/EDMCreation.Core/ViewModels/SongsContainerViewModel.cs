using MvvmCross.Commands;
using MvvmCross.Navigation;
using MvvmCross.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace EDMCreation.Core.ViewModels
{
    public class SongsContainerViewModel : MvxViewModel
    {
        private int _genNum;
        public int GenNum { get { return _genNum; } set { SetProperty(ref _genNum, value); } }

        private List<SongViewModel> _songs;
        public List<SongViewModel> Songs { get { return _songs; } set { SetProperty(ref _songs, value); } }
        public SongsContainerViewModel(int genNum, List<SongViewModel> songs)
        {
            _genNum = genNum;
            _songs = songs;
        }
    }
}
