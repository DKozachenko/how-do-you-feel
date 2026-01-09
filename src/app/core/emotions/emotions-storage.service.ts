import { Injectable } from '@angular/core';
import { Emotion } from '../model/emotion.interface';
import { BaseStorageService } from '../storage/base-storage/base-storage.service';
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
