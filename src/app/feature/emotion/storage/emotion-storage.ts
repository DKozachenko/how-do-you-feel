import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Emotion } from '@core/model/emotion.interface';
import { IonicStorageService } from '@core/storage/ionic-storage.service';
import { EMOTION_STORAGE_KEY } from './emotion.storage-key';

@Injectable({
  providedIn: 'root',
})
export class EmotionStorageService {
  private readonly storageService = inject(IonicStorageService);

  getAll(): Observable<Emotion[] | null> {
    return this.storageService.get<Emotion[]>(EMOTION_STORAGE_KEY);
  }

  create(newEntity: Emotion): Observable<void> {
    return this.getAll().pipe(
      switchMap((allEntities) => {
        const updatedEntities = [...(allEntities ?? []), newEntity];

        return this.storageService.set<Emotion[]>(EMOTION_STORAGE_KEY, updatedEntities);
      }),
    );
  }
}
