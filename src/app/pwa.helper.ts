import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate, VersionDetectedEvent, VersionReadyEvent } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, first } from 'rxjs/operators'


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
      console.log('check swUpdate', this.swUpdate);
      const currentVersion = window.localStorage.getItem(currentVersionKey);

      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionDetectedEvent => evt.type === 'VERSION_DETECTED'))
        .subscribe((event) => {
          console.log('swUpdate.available', event);

          const newVersion = event.version;
          // check Update
          window.localStorage.setItem(newVersionKey, newVersion.hash);

          console.log('available: current version is', currentVersion);
          console.log('available: available version is', event.version);

          // download Update
          this.swUpdate.activateUpdate().then(() => {
            // Update gets downloaded
            // `Current version is: ${event.current} - Update Available; ${event.available}`

            const snack = this.snackbar.open(`Update for the App Available`, 'Reload');
            const sub = snack.onAction().subscribe(() => {
              window.location.reload();
              if (currentVersion) {
                window.localStorage.setItem(currentVersionKey, newVersion.hash);
              }
              sub.unsubscribe();
            });
          });
        });

      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(event => {
          console.log('activated: current version is', event.currentVersion);
          console.log('activated: previous version is', event.latestVersion);
        });


      // Handling an unrecoverable state of versions
      this.swUpdate.unrecoverable.subscribe(event => {
        console.log('swUpdate.unrecoverable', event);
        const snack = this.snackbar.open(`An error occurred that we cannot recover from:\n${event.reason}\n\n`, 'Reload');
        const sub = snack.onAction().subscribe(() => {
          window.location.reload();
          sub.unsubscribe();
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

  shareLink(link: string) {
    if (navigator.share) {
      navigator.share({
        title: 'ol-ng-dwd-Radar - Link',
        url: link,
      }).then(() => console.log('Successful share')).catch((error) => console.log('Error sharing', error));
    }
  }
}
