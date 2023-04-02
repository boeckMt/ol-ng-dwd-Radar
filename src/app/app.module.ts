import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { TimeSliderComponent } from './time-slider/time-slider.component';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

/** dragable Footer */
import { PwaHelper } from './pwa.helper';
import { DwdWeatherReportsComponent } from './dwd-weather-reports/dwd-weather-reports.component';


@NgModule({
  declarations: [
    AppComponent,
    TimeSliderComponent,
    DwdWeatherReportsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule, MatProgressBarModule, MatIconModule, MatSliderModule,
    MatButtonModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatSnackBarModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [PwaHelper],
  bootstrap: [AppComponent]
})
export class AppModule { }
