import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class LogUpdateService {

  constructor(updates: SwUpdate, snackbar: MatSnackBar) {
    updates.available.subscribe(event => {
      const snack = snackbar.open(`Current version is: ${event.current} - Update Available; ${event.available}`, 'Reload');
      snack.onAction().subscribe(() => {
        window.location.reload();
      });

      setTimeout(() => {
        snack.dismiss();
      }, 6000);
    });
    updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
      const snack = snackbar.open(`Old version was: ${event.previous} - New version is; ${event.current}`, 'Close');
    });
  }
}
