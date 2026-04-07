import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { Setting, SettingsIds } from '../model/setting.interface';
import { IonicStorageService } from '../storage/ionic-storage/ionic-storage.service';
import { SETTINGS_STORAGE_KEY } from './settings.storage-key';

@Injectable({
  providedIn: 'root',
})
export class SettingsStorageService {
  private readonly storageService = inject(IonicStorageService);
  private storageKey = SETTINGS_STORAGE_KEY;

  getAll(): Observable<Setting<unknown>[] | null> {
    return this.storageService.get<Setting<unknown>[]>(this.storageKey);
  }

  getById<T>(id: SettingsIds): Observable<Setting<T> | null> {
    return this.getAll().pipe(
      map((allEntities) => <Setting<T>>allEntities?.find((entity) => entity.id === id) ?? null),
    );
  }

  create<T>(newSetting: Setting<T>): Observable<void> {
    return this.getAll().pipe(
      switchMap((allEntities) => {
        const updatedEntities: Setting<unknown>[] = [...(allEntities ?? []), newSetting];

        return this.storageService.set<Setting<unknown>[]>(this.storageKey, updatedEntities);
      }),
    );
  }

  updateById<T>(id: SettingsIds, newData: Omit<Setting<T>, 'id'>): Observable<void> {
    return this.getAll().pipe(
      switchMap((allEntities) => {
        const updatedEntities = (allEntities ?? []).map((entity) =>
          entity.id === id ? <Setting<T>>{ id, ...newData } : entity,
        );

        return this.storageService.set<Setting<unknown>[]>(this.storageKey, updatedEntities);
      }),
    );
  }

  removeById(id: string): Observable<void> {
    return this.getAll().pipe(
      switchMap((allEntities) => {
        const updatedEntities = (allEntities ?? []).filter((entity) => entity.id !== id);

        return this.storageService.set<Setting<unknown>[]>(this.storageKey, updatedEntities);
      }),
    );
  }
}
