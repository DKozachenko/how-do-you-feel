import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonNote,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { startOfMinute } from 'date-fns';
import { debounceTime, map, of, startWith, switchMap } from 'rxjs';
import { EmotionStorageService } from '@core/emotions/emotions-storage.service';
import { Emotion } from '@core/model/emotion.interface';
import { ModalRole } from '@core/model/modal-role.enum';
import { ControlErrorPipe } from '@core/pipes/control-errors/control-errors.pipe';
import { CssColorsHintButton } from '@pattern/css-colors-hint/css-colors-hint-button/css-colors-hint-button';
import { EmotionHintButton } from '@pattern/emotions-hint/emotion-hint-button/emotion-hint-button';
import { ExistingColorOptionsButton } from '@pattern/existing-color-options/existing-color-options-button/existing-color-options-button';

@Component({
  selector: 'app-add-emotion-modal',
  templateUrl: './add-emotion-modal.html',
  styleUrl: './add-emotion-modal.scss',
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonButton,
    IonTitle,
    IonButtons,
    IonIcon,
    IonItem,
    IonInput,
    IonTextarea,
    ReactiveFormsModule,
    EmotionHintButton,
    CssColorsHintButton,
    ControlErrorPipe,
    IonNote,
    IonToggle,
    ExistingColorOptionsButton,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEmotionModal {
  private readonly modalController = inject(ModalController);
  private readonly emotionsStorageService = inject(EmotionStorageService);

  protected readonly ModalRole = ModalRole;

  form = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    color: new FormControl<string>('', [Validators.required]),
    comment: new FormControl<string>(''),
    private: new FormControl<boolean>(false, [Validators.required]),
  });

  protected uniqueExistingColors$ = this.form.controls.name.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    switchMap((name) => {
      if (!name) {
        return of<string[]>([]);
      }

      return this.emotionsStorageService.getAll().pipe(
        map((allEmotions) =>
          (allEmotions ?? []).filter((emotion) => emotion.name.trim().toLowerCase() === name.trim().toLowerCase()),
        ),
        map((emotionsWithSameName) => emotionsWithSameName.map((emotion) => emotion.color)),
        map((existingColors) => Array.from(new Set(existingColors))),
      );
    }),
  );

  close(role: ModalRole, data?: Omit<Emotion, 'id'>): void {
    this.modalController.dismiss(data, role);
  }

  applyColor(color: string): void {
    this.form.patchValue({ color });
  }

  confirmCreation(): void {
    const entity: Omit<Emotion, 'id'> = {
      name: this.form.value.name ?? '',
      color: this.form.value.color ?? '',
      comment: this.form.value.comment || undefined,
      private: this.form.value.private ?? false,
      dateTime: startOfMinute(new Date()),
    };

    this.close(ModalRole.Confirm, entity);
  }
}
