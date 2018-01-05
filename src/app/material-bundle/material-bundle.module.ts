import { NgModule } from '@angular/core';
import { MatToolbarModule, MatProgressBarModule, MatIconModule, MatSliderModule, MatButtonModule} from '@angular/material';

@NgModule({
  imports: [MatToolbarModule, MatProgressBarModule, MatIconModule, MatSliderModule, MatButtonModule],
  exports: [MatToolbarModule, MatProgressBarModule, MatIconModule, MatSliderModule, MatButtonModule],
  declarations: []
})
export class MaterialBundleModule { }
