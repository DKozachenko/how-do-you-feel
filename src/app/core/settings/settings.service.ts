import { Injectable } from '@angular/core';
import { Setting } from '@core/model/setting.interface';
import { BaseStorageService } from '../storage/base-storage/base-storage.service';
import { SETTINGS_STORAGE_KEY } from './settings.storage-key';

@Injectable({
  providedIn: 'root',
})
export class SettingsStorageService extends BaseStorageService<Setting<unknown>> {
  constructor() {
    super();
    this.setStorageKey(SETTINGS_STORAGE_KEY);
  }
}
