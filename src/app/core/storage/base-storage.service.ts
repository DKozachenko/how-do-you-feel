import { Injectable, inject } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { BaseEntity } from '../model/base-entity.interface';
import { IonicStorageService } from './ionic-storage.service';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseStorageService<T extends BaseEntity> {
  private readonly storageService = inject(IonicStorageService);
  private storageKey = '';

  protected setStorageKey(key: string): void {
    this.storageKey = key;
  }

  getAll(): Observable<T[] | null> {
    return this.storageService.get<T[]>(this.storageKey);
  }

  getById(id: string): Observable<T | null> {
    return this.getAll().pipe(map((allEntities) => allEntities?.find((entity) => entity.id === id) ?? null));
  }

  create(newEntity: Omit<T, 'id'>): Observable<void> {
    const entityForSaving: T = <T>{
      ...newEntity,
      id: uuidv4(),
    };

    return this.getAll().pipe(
      switchMap((allEntities) => {
        const updatedEntities = [...(allEntities ?? []), entityForSaving];

        return this.storageService.set<T[]>(this.storageKey, updatedEntities);
      }),
    );
  }

  updateById(id: string, newData: Omit<T, 'id'>): Observable<void> {
    return this.getAll().pipe(
      switchMap((allEntities) => {
        const updatedEntities = (allEntities ?? []).map((entity) =>
          entity.id === id ? <T>{ id, ...newData } : entity,
        );

        return this.storageService.set<T[]>(this.storageKey, updatedEntities);
      }),
    );
  }

  removeById(id: string): Observable<void> {
    return this.getAll().pipe(
      switchMap((allEntities) => {
        const updatedEntities = (allEntities ?? []).filter((entity) => entity.id !== id);

        return this.storageService.set<T[]>(this.storageKey, updatedEntities);
      }),
    );
  }
}
