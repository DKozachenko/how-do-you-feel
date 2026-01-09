import { Injectable, inject } from '@angular/core';
import { defaultIfEmpty, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { DislikesStorageService } from '../dislikes/dislikes-storage.service';
import { DISLIKES_STORAGE_KEY } from '../dislikes/dislikes.storage-key';
import { EmotionStorageService } from '../emotions/emotions-storage.service';
import { EMOTIONS_STORAGE_KEY } from '../emotions/emotions.storage-key';
import { LikesStorageService } from '../likes/likes-storage.service';
import { LIKES_STORAGE_KEY } from '../likes/likes.storage-key';
import { Action } from '../model/action.interface';
import { Emotion } from '../model/emotion.interface';
import { PRIVATE_FIELD_MIGRATION_KEY } from '../model/migration.constants';
import { IonicStorageService } from '../storage/ionic-storage/ionic-storage.service';

@Injectable({
  providedIn: 'root',
})
export class MigrationService {
  private readonly storageService = inject(IonicStorageService);
  private readonly emotionsStorageService = inject(EmotionStorageService);
  protected readonly dislikesStorageService = inject(DislikesStorageService);
  protected readonly likesStorageService = inject(LikesStorageService);

  runAllMigrations(): Observable<void> {
    let migrationSequence$ = of<void>(void 0);

    return this.getMigrationState().pipe(
      switchMap((migrationState) => {
        if (!migrationState[PRIVATE_FIELD_MIGRATION_KEY]) {
          migrationSequence$ = migrationSequence$.pipe(
            switchMap(() => this.runPrivateFieldMigration()),
            switchMap(() => this.storageService.set<boolean>(PRIVATE_FIELD_MIGRATION_KEY, true)),
          );
        }

        return migrationSequence$;
      }),
    );
  }

  private runPrivateFieldMigration(): Observable<void> {
    const updateLikes$ = this.likesStorageService.getAll().pipe(
      map((likesWithoutPrivateField) =>
        (likesWithoutPrivateField ?? []).map((action) => ({
          ...action,
          private: false,
        })),
      ),
      switchMap((likesWithPrivateField) => this.storageService.set<Action[]>(LIKES_STORAGE_KEY, likesWithPrivateField)),
    );

    const updateDislikes$ = this.dislikesStorageService.getAll().pipe(
      map((dislikesWithoutPrivateField) =>
        (dislikesWithoutPrivateField ?? []).map((action) => ({
          ...action,
          private: false,
        })),
      ),
      switchMap((dislikesWithPrivateField) =>
        this.storageService.set<Action[]>(DISLIKES_STORAGE_KEY, dislikesWithPrivateField),
      ),
    );

    const updateEmotions$ = this.emotionsStorageService.getAll().pipe(
      map((emotionsWithoutPrivateField) =>
        (emotionsWithoutPrivateField ?? []).map((action) => ({
          ...action,
          private: false,
        })),
      ),
      switchMap((emotionsWithPrivateField) =>
        this.storageService.set<Emotion[]>(EMOTIONS_STORAGE_KEY, emotionsWithPrivateField),
      ),
    );

    return forkJoin([updateLikes$, updateDislikes$, updateEmotions$]).pipe(
      defaultIfEmpty([]),
      map(() => void 0),
    );
  }

  private getMigrationState(): Observable<{ [PRIVATE_FIELD_MIGRATION_KEY]: boolean }> {
    return this.storageService.get<boolean>(PRIVATE_FIELD_MIGRATION_KEY).pipe(
      map((value) => ({
        [PRIVATE_FIELD_MIGRATION_KEY]: value ?? false,
      })),
    );
  }
}
