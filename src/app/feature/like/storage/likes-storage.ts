import { Injectable } from '@angular/core';
import { Action } from '@core/model/action.interface';
import { BaseStorageService } from '@core/storage/base-storage.service';
import { LIKES_STORAGE_KEY } from './likes.storage-key';

@Injectable()
export class LikesStorageService extends BaseStorageService<Action> {
  constructor() {
    super();
    this.setStorageKey(LIKES_STORAGE_KEY);
    this.setPlaceToInsertNewEntity('begin');
  }
}
