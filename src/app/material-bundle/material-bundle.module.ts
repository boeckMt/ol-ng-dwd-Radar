import { NgModule } from '@angular/core';
import { MatToolbarModule, MatProgressBarModule, MatIconModule, MatSliderModule, MatButtonModule, MatSelectModule, MatCardModule, MatInputModule, MatFormFieldModule} from '@angular/material';

@NgModule({
  imports: [MatToolbarModule, MatProgressBarModule, MatIconModule, MatSliderModule, MatButtonModule, MatSelectModule, MatCardModule, MatInputModule, MatFormFieldModule],
  exports: [MatToolbarModule, MatProgressBarModule, MatIconModule, MatSliderModule, MatButtonModule, MatSelectModule, MatCardModule, MatInputModule, MatFormFieldModule],
  declarations: []
})
export class MaterialBundleModule { }
