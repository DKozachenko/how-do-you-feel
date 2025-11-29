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
  IonTextarea,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { from, switchMap } from 'rxjs';
import { Emotion } from '@core/model/emotion.interface';
import { ModalRole } from '@core/model/modal-role.enum';
import { EmotionsHintModal } from '../emotions-hint-modal/emotions-hint-modal';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEmotionModal {
  private readonly modalController = inject(ModalController);

  protected readonly ModalRole = ModalRole;

  form = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    comment: new FormControl<string>(''),
    color: new FormControl<string>('', [Validators.required]),
  });

  close(role: ModalRole, data?: Omit<Emotion, 'id'>): void {
    this.modalController.dismiss(data, role);
  }

  openEmotionsHintModal(): void {
    from(
      this.modalController.create({
        component: EmotionsHintModal,
        cssClass: 'slider-modal',
      }),
    )
      .pipe(switchMap((modal) => modal.present()))
      .subscribe();
  }

  confirmCreation(): void {
    const entity: Omit<Emotion, 'id'> = {
      name: this.form.value.name ?? '',
      comment: this.form.value.comment || undefined,
      color: this.form.value.color ?? '',
      dateTime: new Date(),
    };

    this.close(ModalRole.Confirm, entity);
  }
}
