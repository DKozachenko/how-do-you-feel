import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';
import { IonicGestureConfig } from '@core/gesture/configs/ionic-gesture-config';
import { init } from './app.initializer';
import { routes } from './app.routes';

registerLocaleData(localeRu);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideIonicAngular({
      useSetInputAPI: true,
    }),
    importProvidersFrom(IonicStorageModule.forRoot()),
    provideAppInitializer(init),
    { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
