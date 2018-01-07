import { NgModule } from '@angular/core';
import { MatToolbarModule, MatProgressBarModule, MatIconModule, MatSliderModule, MatButtonModule, MatSelectModule} from '@angular/material';

@NgModule({
  imports: [MatToolbarModule, MatProgressBarModule, MatIconModule, MatSliderModule, MatButtonModule, MatSelectModule],
  exports: [MatToolbarModule, MatProgressBarModule, MatIconModule, MatSliderModule, MatButtonModule, MatSelectModule],
  declarations: []
})
export class MaterialBundleModule { }
