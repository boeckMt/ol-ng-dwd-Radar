import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { MaterialBundleModule } from './material-bundle/material-bundle.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { TimeSliderComponent } from './time-slider/time-slider.component';


@NgModule({
  declarations: [
    AppComponent,
    TimeSliderComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    MaterialBundleModule
  ],
  providers: [], //services...
  bootstrap: [AppComponent]
})
export class AppModule { }
