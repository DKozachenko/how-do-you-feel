import { Injectable } from '@angular/core';
import { Action } from '../model/action.interface';
import { BaseStorageService } from '../storage/base-storage.service';
import { LIKES_STORAGE_KEY } from './likes.storage-key';

@Injectable({
  providedIn: 'root',
})
export class LikesStorageService extends BaseStorageService<Action> {
  constructor() {
    super();
    this.setStorageKey(LIKES_STORAGE_KEY);
    this.setPlaceToInsertNewEntity('begin');
  }
}
