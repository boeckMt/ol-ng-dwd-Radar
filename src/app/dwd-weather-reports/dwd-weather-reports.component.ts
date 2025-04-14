import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';

import { MatOption } from '@angular/material/core';
import { ILocationItem, IPlaceItem } from '../data.utills';




@Component({
  selector: 'app-dwd-weather-reports',
  standalone: true,
  templateUrl: './dwd-weather-reports.component.html',
  styleUrls: ['./dwd-weather-reports.component.scss'],
  imports: [MatFormField, MatSelect, MatOption]
})
export class DwdWeatherReportsComponent implements OnInit {
  @Input() location1: string = 'bayern';
  @Input() location2: string = 'muenchen';
  @Input() locations: ILocationItem[] = [];
  @Input() places: IPlaceItem[] = [];

  constructor() {

  }

  ngOnInit(): void {
  }

}
