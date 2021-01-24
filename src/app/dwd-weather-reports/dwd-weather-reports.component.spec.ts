import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DwdWeatherReportsComponent } from './dwd-weather-reports.component';

describe('DwdWeatherReportsComponent', () => {
  let component: DwdWeatherReportsComponent;
  let fixture: ComponentFixture<DwdWeatherReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DwdWeatherReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DwdWeatherReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
