import { Component, ElementRef, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import olMap from 'ol/Map';
import { addFileLayer } from '../map.utills';
import { MatButton } from '@angular/material/button';

import { MatLabel } from '@angular/material/form-field';

@Component({
    selector: 'app-import-data',
    standalone: true,
    templateUrl: './import-data.component.html',
    styleUrls: ['./import-data.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatButton, MatLabel]
})
export class ImportDataComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Input() map!: olMap;
  reader = new FileReader();
  selectedFile: File | null = null;
  constructor() {

  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
    if (this.selectedFile) {

      this.reader.readAsText(this.selectedFile, "UTF-8");
      this.reader.onload = (evt: ProgressEvent<FileReader>) => {
        const fileData = evt.target?.result;
        if (typeof fileData === 'string') {
          addFileLayer(this.map, fileData);
        }
      }

    }

  }

  removeFileLayers() {
    addFileLayer(this.map, undefined, true);
    this.fileInput.nativeElement.value = '';
    this.selectedFile = null;
  }

}
