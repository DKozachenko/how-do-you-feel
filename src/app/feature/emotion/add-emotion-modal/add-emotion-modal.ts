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
import { Emotion } from '@core/model/emotion.interface';
import { ModalRole } from '@core/model/modal-role.enum';
import { ControlErrorPipe } from '@core/pipes/control-errors/control-errors.pipe';
import { CssColorsHintButton } from '@pattern/css-colors-hint/css-colors-hint-button/css-colors-hint-button';
import { EmotionHintButton } from '@pattern/emotions-hint/emotion-hint-button/emotion-hint-button';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEmotionModal {
  private readonly modalController = inject(ModalController);

  protected readonly ModalRole = ModalRole;

  form = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    color: new FormControl<string>('', [Validators.required]),
    comment: new FormControl<string>(''),
    private: new FormControl<boolean>(false, [Validators.required]),
  });

  close(role: ModalRole, data?: Omit<Emotion, 'id'>): void {
    this.modalController.dismiss(data, role);
  }

  confirmCreation(): void {
    const entity: Omit<Emotion, 'id'> = {
      name: this.form.value.name ?? '',
      color: this.form.value.color ?? '',
      comment: this.form.value.comment || undefined,
      private: this.form.value.private ?? false,
      dateTime: new Date(),
    };

    this.close(ModalRole.Confirm, entity);
  }
}
