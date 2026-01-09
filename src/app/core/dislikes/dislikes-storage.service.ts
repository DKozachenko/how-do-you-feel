import { Injectable } from '@angular/core';
import { Action } from '../model/action.interface';
import { BaseStorageService } from '../storage/base-storage/base-storage.service';
import { DISLIKES_STORAGE_KEY } from './dislikes.storage-key';

@Injectable({
  providedIn: 'root',
})
export class DislikesStorageService extends BaseStorageService<Action> {
  constructor() {
    super();
    this.setStorageKey(DISLIKES_STORAGE_KEY);
    this.setPlaceToInsertNewEntity('begin');
  }
}
