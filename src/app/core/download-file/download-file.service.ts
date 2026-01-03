import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  download(parts: BlobPart[], filename: string): void {
    if (Capacitor.getPlatform() === 'web') {
      this.downloadPwa(parts, filename);
      return;
    }

    this.downloadMobile();
  }

  private downloadPwa(parts: BlobPart[], filename: string): void {
    const file = new File(parts, filename, { type: 'text/plain;charset=utf-8' });
    saveAs(file);
  }

  private downloadMobile(): void {}
}
