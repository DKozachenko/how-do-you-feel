import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonText,
  IonTitle,
  IonToolbar,
  IonButton,
  ToastController,
  ViewWillEnter,
  IonRadioGroup,
  IonRadio,
  RadioGroupChangeEventDetail,
} from '@ionic/angular/standalone';

import { forkJoin, from, switchMap } from 'rxjs';
import { DislikesStorageService } from '@core/dislikes/dislikes-storage.service';
import { DownloadService } from '@core/download-file/download-file.service';
import { EmotionStorageService } from '@core/emotions/emotions-storage.service';
import { LikesStorageService } from '@core/likes/likes-storage.service';

import { ActionOrder } from '@core/model/action-order.constants';
import { Setting, SettingsIds } from '@core/model/setting.interface';
import { SettingsStorageService } from '@core/settings/settings.service';
// eslint-disable-next-line boundaries/no-unknown
import packageJson from '../../../../../package.json';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
  imports: [
    IonHeader,
    IonTitle,
    IonToolbar,
    IonContent,
    IonText,
    IonButton,
    IonRadioGroup,
    IonRadio,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage implements ViewWillEnter {
  private readonly emotionsStorageService = inject(EmotionStorageService);
  private readonly dislikesStorageService = inject(DislikesStorageService);
  private readonly likesStorageService = inject(LikesStorageService);
  private readonly settingsStorageService = inject(SettingsStorageService);
  private readonly downloadService = inject(DownloadService);
  private readonly toastController = inject(ToastController);

  protected readonly ActionOrder = ActionOrder;

  version = packageJson.version;

  form = new FormGroup({
    actionOrder: new FormControl<ActionOrder>(ActionOrder.DEFAULT_ORDER, [Validators.required]),
  });

  ionViewWillEnter(): void {
    this.load();
  }

  updateActionOrderSetting(data: RadioGroupChangeEventDetail) {
    this.settingsStorageService.updateById(SettingsIds.ACTION_ORDER, { value: data.value }).subscribe();
  }

  exportData(): void {
    forkJoin({
      emotions: this.emotionsStorageService.getAll(),
      likes: this.likesStorageService.getAll(),
      dislikes: this.dislikesStorageService.getAll(),
    })
      .pipe(
        switchMap((data) => this.downloadService.download(JSON.stringify(data), 'how-do-you-feel.data.json')),
        switchMap(() =>
          from(
            this.toastController.create({
              message: 'Файл успешно скачан',
              duration: 2000,
              position: 'bottom',
            }),
          ),
        ),
        switchMap((toast) => from(toast.present())),
      )
      .subscribe({
        error: (err) => console.error('Ошибка при скачивании файла', err),
      });
  }

  private load(): void {
    forkJoin([this.settingsStorageService.getById<ActionOrder>(SettingsIds.ACTION_ORDER)]).subscribe(
      ([actionOrderSetting]) => {
        this.updateFormFromSettings(actionOrderSetting);
      },
    );
  }

  private updateFormFromSettings(actionOrderSetting: Setting<ActionOrder> | null): void {
    this.form.patchValue({
      actionOrder: actionOrderSetting?.value ?? ActionOrder.DEFAULT_ORDER,
    });
  }
}
