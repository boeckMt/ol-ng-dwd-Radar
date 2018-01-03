import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';


import { AppComponent } from './app.component';
import { MapstateService } from './mapstate.service';
import { SliderComponent } from './slider/slider.component';


@NgModule({
  declarations: [
    AppComponent,
    SliderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [MapstateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
