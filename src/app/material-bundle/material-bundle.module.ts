import { NgModule } from '@angular/core';
import { MatToolbarModule, MatProgressBarModule, MatIconModule, MatSliderModule, MatButtonModule, MatSelectModule, MatCardModule} from '@angular/material';

@NgModule({
  imports: [MatToolbarModule, MatProgressBarModule, MatIconModule, MatSliderModule, MatButtonModule, MatSelectModule, MatCardModule],
  exports: [MatToolbarModule, MatProgressBarModule, MatIconModule, MatSliderModule, MatButtonModule, MatSelectModule, MatCardModule],
  declarations: []
})
export class MaterialBundleModule { }
