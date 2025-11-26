import { inject } from '@angular/core';
import { IonicStorageService } from '@core/storage/ionic-storage.service';

export function init() {
  const storageService = inject(IonicStorageService);

  return storageService.init();
}
