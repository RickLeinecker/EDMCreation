
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Data;
using System.Windows.Input;

namespace EDMCreation.Wpf.Components
{
    public class SeekBar : Slider
    {        
        public bool IsDragging
        {
            get { return (bool)GetValue(IsDraggingProperty); }
            set { SetValue(IsDraggingProperty, value); }
        }
        public static readonly DependencyProperty IsDraggingProperty =
            DependencyProperty.Register("IsDragging", typeof(bool), typeof(SeekBar));

        public double SeekValue 
        {
            get { return (double)GetValue(SeekValueProperty); }
            set { SetValue(SeekValueProperty, value); } 
        }
        public static readonly DependencyProperty SeekValueProperty = 
            DependencyProperty.Register("SeekValue", typeof(double), typeof(SeekBar), new FrameworkPropertyMetadata((double)0, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                    SeekValuePropertyChanged, null, false, UpdateSourceTrigger.PropertyChanged));

        private static void SeekValuePropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            if (d is SeekBar sbar)
            {
                sbar.UpdateValue();
            }
        }
        private void UpdateValue()
        {
            if (!IsDragging)
            {
                Value = SeekValue;
            }
        }

        private bool clickedInSlider;

        public SeekBar()
        {
            IsMoveToPointEnabled = true;
        }

        protected override void OnThumbDragStarted(DragStartedEventArgs e)
        {
            
            IsDragging = true;
            base.OnThumbDragStarted(e);
        }

        protected override void OnThumbDragCompleted(DragCompletedEventArgs e)
        {
            IsDragging = false;
            SeekValue = Value;
            base.OnThumbDragCompleted(e);
        }

        protected override void OnMouseMove(MouseEventArgs e)
        {
            if (e.LeftButton == MouseButtonState.Pressed && clickedInSlider)
            {
                var thumb = (this.Template.FindName("PART_Track", this) as Track).Thumb;
                thumb.RaiseEvent(new MouseButtonEventArgs(e.MouseDevice, e.Timestamp, MouseButton.Left)
                {
                    RoutedEvent = UIElement.MouseLeftButtonDownEvent,
                    Source = e.Source
                });
            }
            base.OnMouseMove(e);
        }

        protected override void OnPreviewMouseLeftButtonDown(MouseButtonEventArgs e)
        {
            clickedInSlider = true;
            IsDragging = true;
            base.OnPreviewMouseLeftButtonDown(e);
        }

        protected override void OnPreviewMouseLeftButtonUp(MouseButtonEventArgs e)
        {
            clickedInSlider = false;
            IsDragging = false;
            base.OnPreviewMouseLeftButtonUp(e);
        }

    }
}
