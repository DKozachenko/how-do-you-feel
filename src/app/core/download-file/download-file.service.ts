import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { saveAs } from 'file-saver';
import { from, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  download(dataStr: string, filename: string): Observable<void> {
    if (Capacitor.getPlatform() === 'web') {
      return this.downloadPwa(dataStr, filename);
    }

    return this.downloadMobile(dataStr, filename);
  }

  private downloadPwa(dataStr: string, filename: string): Observable<void> {
    const file = new File([dataStr], filename, { type: 'application/json;charset=utf-8' });
    saveAs(file);
    return of(void 0);
  }

  private downloadMobile(dataStr: string, filename: string): Observable<void> {
    return from(
      Filesystem.writeFile({
        path: filename,
        data: dataStr,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
        recursive: true,
      }),
    ).pipe(map(() => void 0));
  }
}
