import { Component, OnInit, OnChanges } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { findClosestDate } from '../utills';

export interface IdateChange {
  last: string | undefined; now: string; next: string | undefined;
}

@Component({
  selector: 'app-time-slider',
  templateUrl: './time-slider.component.html',
  styleUrls: ['./time-slider.component.scss'],
  providers: [DatePipe]
})
export class TimeSliderComponent implements OnChanges {

  /** ISO string dates UTC */
  @Input() dates: string[];
  @Input() startTime?: string;
  @Output('dateChange') change: EventEmitter<IdateChange> = new EventEmitter();

  public sValue = 0;
  public sMin = 0;
  public sMax: number;
  public sStep = 1;

  dValue: string;
  playing = false;
  intervalID: any;
  isdisabled = true;
  constructor(private datePipe: DatePipe) {

  }

  formatLabel = (value: number) => {
    const now = (this.dates && this.sValue) ? this.datePipe.transform(this.dates[this.sValue], 'HH:mm') : value;
    return now;
  }

  setSlider(value: '+' | '-') {
    if (value === '+') {
      this.sValue += this.sStep;
      if (this.sValue > this.sMax) {
        this.sValue = this.sMax;
      }
    } else {
      this.sValue -= this.sStep;
      if (this.sValue < this.sMin) {
        this.sValue = this.sMin;
      }
    }
    this.sliderOnChange();
  }

  playSlider() {
    const time_step = 1400;
    this.playing = !this.playing;
    // console.log(this.playing);
    if (this.playing) {
      if (this.sValue === this.sMax) {
        this.sValue = this.sMin;
      }
      this.intervalID = setInterval(() => {
        this.setSlider('+');
        if (this.sValue === this.sMax) {
          clearInterval(this.intervalID);
          this.playing = false;
          // console.log(this.playing);
        }
      }, time_step);
    } else {
      // console.log(this.intervalID);
      clearInterval(this.intervalID);
      // console.log(this.playing);
    }

  }

  sliderOnChange(value?: any) {
    this.dValue = this.dates[this.sValue];
    this.change.emit({
      last: this.dates[this.sValue - 1],
      now: this.dates[this.sValue],
      next: this.dates[this.sValue + 1]
    });
  }

  ngOnChanges(changes: any) {
    // only run when property "dates" changed
    if (changes['dates'] && this.dates && this.dates.length > 0) {
      // console.log(this.dates)
      this.isdisabled = false;
      this.sMax = this.dates.length - 1;
      this.dValue = this.dates[this.sMin];


      const dateIndex = findClosestDate(this.dates).dateBefore;
      if (dateIndex) {
        this.dValue = this.dates[dateIndex];
        this.sValue = dateIndex;
      } else {
        this.dValue = this.dates[this.sMax];
        this.sValue = this.sMax;
      }

      if (this.startTime) {
        const startIndex = this.dates.indexOf(this.startTime);
        if (startIndex) {
          this.dValue = this.dates[startIndex];
          this.sValue = startIndex;
        }
      }

      this.sliderOnChange();
    }
  }
}

