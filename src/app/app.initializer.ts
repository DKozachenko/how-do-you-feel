import { inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { MigrationService } from '@core/migration/migration.service';
import { IonicStorageService } from '@core/storage/ionic-storage.service';

export function init() {
  const storageService = inject(IonicStorageService);
  const migrationService = inject(MigrationService);

  return storageService.init().pipe(switchMap(() => migrationService.runAllMigrations()));
}
