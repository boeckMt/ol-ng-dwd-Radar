import { enableProdMode, importProvidersFrom } from '@angular/core';


import { environment } from './environments/environment';
import { PwaHelper } from './app/pwa.helper';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, ReactiveFormsModule, MatToolbarModule, MatProgressBarModule, MatIconModule, MatSliderModule, MatButtonModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatSnackBarModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })),
        PwaHelper,
        provideAnimations()
    ]
})
  .catch(err => console.error(err));
