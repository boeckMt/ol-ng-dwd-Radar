import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule}   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialBundleModule } from './material-bundle/material-bundle.module';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { TimeSliderComponent } from './time-slider/time-slider.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LogUpdateService } from './log-update.service'


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
    MaterialBundleModule,
    ServiceWorkerModule.register('/ol-ng-dwd-Radar/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [ LogUpdateService ], //services...
  bootstrap: [AppComponent]
})
export class AppModule { }
