import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonContent, IonHeader, IonText, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';

import { forkJoin, switchMap } from 'rxjs';
import { DislikesStorageService } from '@core/dislikes/dislikes-storage.service';
import { DownloadService } from '@core/download-file/download-file.service';
import { EmotionStorageService } from '@core/emotions/emotions-storage.service';
import { LikesStorageService } from '@core/likes/likes-storage.service';
// eslint-disable-next-line boundaries/no-unknown
import packageJson from '../../../../../package.json';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.html',
  styleUrl: './info-page.scss',
  imports: [IonHeader, IonTitle, IonToolbar, IonContent, IonText, IonButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoPage {
  private readonly emotionsStorageService = inject(EmotionStorageService);
  private readonly dislikesStorageService = inject(DislikesStorageService);
  private readonly likesStorageService = inject(LikesStorageService);
  private readonly downloadService = inject(DownloadService);

  version = packageJson.version;

  exportData(): void {
    forkJoin({
      emotions: this.emotionsStorageService.getAll(),
      likes: this.likesStorageService.getAll(),
      dislikes: this.dislikesStorageService.getAll(),
    })
      .pipe(switchMap((data) => this.downloadService.download(JSON.stringify(data), 'how-do-you-feel.data.json')))
      .subscribe({
        error: (err) => console.error('Ошибка при скачивании файла', err),
      });
  }
}
