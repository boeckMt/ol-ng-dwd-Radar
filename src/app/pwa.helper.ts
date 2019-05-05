import { Injectable } from '@angular/core';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class PwaHelper {
    constructor(private swUpdate: SwUpdate, private snackbar: MatSnackBar) {

    }

    checkUpdates() {
        if (this.swUpdate.isEnabled) {
            this.swUpdate.available.subscribe((event: UpdateAvailableEvent) => {
                // check Update

                // download Update
                this.swUpdate.activateUpdate().then(e => {
                    // Update gets downloaded
                    // `Current version is: ${event.current} - Update Available; ${event.available}`
                    const snack = this.snackbar.open(`Update for the App Available`, 'Reload');
                    snack.onAction().subscribe(() => {
                        window.location.reload();
                    });
                });
            });
            this.swUpdate.checkForUpdate();
        }
    }
}
