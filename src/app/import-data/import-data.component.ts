import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import olMap from 'ol/Map';
import { addFileLayer } from '../map.utills';
import { MatButton } from '@angular/material/button';

import { MatLabel } from '@angular/material/form-field';

@Component({
    selector: 'app-import-data',
    standalone: true,
    templateUrl: './import-data.component.html',
    styleUrls: ['./import-data.component.scss'],
    imports: [MatButton, MatLabel]
})
export class ImportDataComponent {
  @ViewChild('fileInput') fileInput: ElementRef;
  @Input() map!: olMap;
  reader = new FileReader();
  selectedFile: any;
  constructor() {

  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] ?? null;
    if (this.selectedFile) {

      this.reader.readAsText(this.selectedFile, "UTF-8");
      this.reader.onload = (evt) => {
        const fileData = evt.target.result;
        if (typeof fileData !== 'string') {
          addFileLayer(this.map, fileData.toString());
        } else {
          addFileLayer(this.map, fileData);
        }
      }

    }

  }

  removeFileLayers() {
    addFileLayer(this.map, null, true);
    this.fileInput.nativeElement.value = '';
    this.selectedFile = null;
  }

}
