import { Injectable } from '@angular/core';
import { Action } from '@core/model/action.interface';
import { BaseStorageService } from '@core/storage/base-storage.service';
import { DISLIKES_STORAGE_KEY } from './dislikes.storage-key';

@Injectable()
export class DisikesStorageService extends BaseStorageService<Action> {
  constructor() {
    super();
    this.setStorageKey(DISLIKES_STORAGE_KEY);
    this.setPlaceToInsertNewEntity('begin');
  }
}
