import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { TimeSliderComponent } from './time-slider/time-slider.component';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

/** dragable Footer */
import { PwaHelper } from './pwa.helper';
import { DwdWeatherReportsComponent } from './dwd-weather-reports/dwd-weather-reports.component';
import { ImportDataComponent } from './import-data/import-data.component';


@NgModule({
  declarations: [
    AppComponent,
    TimeSliderComponent,
    DwdWeatherReportsComponent,
    ImportDataComponent
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
