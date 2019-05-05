import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { TimeSliderComponent } from './time-slider/time-slider.component';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MatToolbarModule, MatProgressBarModule, MatIconModule,
  MatSliderModule, MatButtonModule, MatSelectModule, MatCardModule,
  MatInputModule, MatFormFieldModule, MatSnackBarModule} from '@angular/material';

import { PwaHelper } from './pwa.helper';


@NgModule({
  declarations: [
    AppComponent,
    TimeSliderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule, MatProgressBarModule, MatIconModule, MatSliderModule,
    MatButtonModule, MatSelectModule, MatCardModule, MatInputModule, MatFormFieldModule, MatSnackBarModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [PwaHelper],
  bootstrap: [AppComponent]
})
export class AppModule { }
