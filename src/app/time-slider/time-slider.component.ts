import { Component, OnInit, OnChanges } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { TimeInterval } from 'rxjs';

export interface IdateChange {
  last: string | undefined; now: string; next: string | undefined;
}

@Component({
  selector: 'app-time-slider',
  templateUrl: './time-slider.component.html',
  styleUrls: ['./time-slider.component.scss']
})
export class TimeSliderComponent implements OnInit, OnChanges {

  @Input('dates') dates: string[];
  @Output('dateChange') change: EventEmitter<IdateChange> = new EventEmitter();

  s_value = 0;
  s_min = 0;
  s_max: number;
  s_step = 1;

  d_value: string;
  playing = false;
  intervalID: any;
  isdisabled = true;
  constructor() {

  }

  setSlider(value: '+' | '-') {
    if (value === '+') {
      this.s_value += this.s_step;
      if (this.s_value > this.s_max) {
        this.s_value = this.s_max;
      }
    } else {
      this.s_value -= this.s_step;
      if (this.s_value < this.s_min) {
        this.s_value = this.s_min;
      }
    }
    this.sliderOnChange();
  }

  playSlider() {
    const time_step = 1400;
    this.playing = !this.playing;
    console.log(this.playing);
    if (this.playing) {
      if (this.s_value === this.s_max) {
        this.s_value = this.s_min;
      }
      this.intervalID = setInterval(() => {
        this.setSlider('+');
        if (this.s_value === this.s_max) {
          clearInterval(this.intervalID);
          this.playing = false;
          console.log(this.playing);
        }
      }, time_step);
    } else {
      console.log(this.intervalID);
      clearInterval(this.intervalID);
      console.log(this.playing);
    }

  }

  sliderOnChange(value?: any) {
    this.d_value = this.dates[this.s_value];
    this.change.emit({
      last: this.dates[this.s_value - 1],
      now: this.dates[this.s_value],
      next: this.dates[this.s_value + 1]
    });
  }

  ngOnChanges(changes: any) {
    // only run when property "dates" changed
    if (changes['dates'] && this.dates && this.dates.length > 0) {
      this.isdisabled = false;
      this.s_max = this.dates.length - 1;
      this.d_value = this.dates[this.s_min];


      const dateIndex = this.findClosestDate(this.dates).dateBefore;
      if (dateIndex) {
        this.d_value = this.dates[dateIndex];
        this.s_value = dateIndex;
      } else {
        this.d_value = this.dates[this.s_max];
        this.s_value = this.s_max;
      }

      this.sliderOnChange();
    }
  }

  findClosestDate(_dates: string[]) {
    const testDate = new Date();
    const dates = _dates.map((date) => new Date(date));
    const before = [];
    const after = [];
    const max = dates.length;

    for (let i = 0; i < max; i++) {
      const tar = dates[i];
      const diff = (testDate.getTime() - tar.getTime());
      if (diff > 0) {
        before.push({ diff: diff, index: i });
      } else {
        after.push({ diff: diff, index: i });
      }
    }

    before.sort((a, b) => {
      if (a.diff < b.diff) {
        return -1;
      }
      if (a.diff > b.diff) {
        return 1;
      }
      return 0;
    });

    after.sort((a, b) => {
      if (a.diff > b.diff) {
        return -1;
      }
      if (a.diff < b.diff) {
        return 1;
      }
      return 0;
    });

    // console.log(_dates.join(','))
    // return { dateBefore: _dates[before[0].index], testDate: testDate.toISOString(), dateAfter: _dates[after[0].index] };
    if (before[0] && after[0]) {
      return { dateBefore: before[0].index, dateAfter: after[0].index };
    } else {
      return { dateBefore: false, dateAfter: false };
    }

  }

  ngOnInit() {

  }

}

