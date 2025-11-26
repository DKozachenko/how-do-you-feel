import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { catchError, from, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IonicStorageService {
  private readonly storage = inject(Storage);

  init(): Observable<Storage> {
    return from(this.storage.create());
  }

  set<T>(key: string, value: T): Observable<void> {
    return from(this.storage.set(key, value));
  }

  get<T>(key: string): Observable<T | null> {
    return from(this.storage.get(key)).pipe(catchError(() => of(null)));
  }

  remove(key: string): Observable<void> {
    return from(this.storage.remove(key));
  }
}
