import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';
import { init } from './app.initializer';
import { routes } from './app.routes';

registerLocaleData(localeRu);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideIonicAngular({}),
    importProvidersFrom(IonicStorageModule.forRoot()),
    provideAppInitializer(init),
  ],
};
