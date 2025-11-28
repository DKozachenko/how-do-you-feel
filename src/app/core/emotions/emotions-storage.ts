import { Injectable } from '@angular/core';
import { BaseStorageService } from '@core/storage/base-storage.service';
import { Emotion } from '../model/emotion.interface';
import { EMOTIONS_STORAGE_KEY } from './emotions.storage-key';

@Injectable({
  providedIn: 'root',
})
export class EmotionStorageService extends BaseStorageService<Emotion> {
  constructor() {
    super();
    this.setStorageKey(EMOTIONS_STORAGE_KEY);
  }
}
