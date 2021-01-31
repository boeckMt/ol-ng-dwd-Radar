import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators'


export const currentVersionKey = 'ol-ng-dwd-Radar-current-version';
export const newVersionKey = 'ol-ng-dwd-Radar-new-version';
@Injectable({
  providedIn: 'root'
})
export class PwaHelper {
  constructor(private swUpdate: SwUpdate, appRef: ApplicationRef, private snackbar: MatSnackBar) {
    if (this.swUpdate.isEnabled) {
      // https://angular.io/guide/service-worker-communications
      const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
      appIsStable$.subscribe(() => this.checkUpdates());
    }
  }

  checkUpdates() {
    if (this.swUpdate.isEnabled) {
      console.log('check swUpdate');
      this.swUpdate.available.subscribe((event) => {
        // check Update
        window.localStorage.setItem(currentVersionKey, event.current.hash);
        window.localStorage.setItem(newVersionKey, event.available.hash);

        console.log('available: current version is', event.current);
        console.log('available: available version is', event.available);

        // download Update
        this.swUpdate.activateUpdate().then(() => {
          // Update gets downloaded
          // `Current version is: ${event.current} - Update Available; ${event.available}`

          const snack = this.snackbar.open(`Update for the App Available`, 'Reload');
          const sub = snack.onAction().subscribe(() => {
            window.location.reload();
            sub.unsubscribe();
          });
        });
      });
      this.swUpdate.checkForUpdate();
    }
  }

  /** https://github.com/RobertHajbok/AngularPWA */
  showInstall() {
    if ((navigator as any).standalone === false) {
      // This is an iOS device and we are in the browser
      this.snackbar.open('You can add this PWA to the Home Screen', '', { duration: 3000 });
    }
    if ((navigator as any).standalone === undefined) {
      // It's not iOS
      if (window.matchMedia('(display-mode: browser').matches) {
        // We are in the browser
        window.addEventListener('beforeinstallprompt', this.beforeinstallprompt);
      }
    }
  }

  beforeinstallprompt = (event) => {
    event.preventDefault();
    const sb = this.snackbar.open('Do you want to install this App?', 'Install', { duration: 5000 });
    const sub = sb.onAction().subscribe(() => {
      (event as any).prompt();
      (event as any).userChoice.then();
      sub.unsubscribe();
    });
    window.removeEventListener('beforeinstallprompt', this.beforeinstallprompt);
    return false;
  }
}
