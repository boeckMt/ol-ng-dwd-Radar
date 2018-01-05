import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';


import { AppComponent } from './app.component';
import { TimeSliderComponent } from './time-slider/time-slider.component';


@NgModule({
  declarations: [
    AppComponent,
    TimeSliderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [], //services...
  bootstrap: [AppComponent]
})
export class AppModule { }
