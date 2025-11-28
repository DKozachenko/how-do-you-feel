import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { Emotion } from '@core/model/emotion.interface';
import { ModalRole } from '@core/model/modal-role.enum';

@Component({
  selector: 'app-edit-emotion-modal',
  templateUrl: './edit-emotion-modal.html',
  styleUrl: './edit-emotion-modal.scss',
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
    IonDatetime,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditEmotionModal implements OnInit {
  private readonly modalController = inject(ModalController);

  protected readonly ModalRole = ModalRole;

  emotion = input.required<Emotion>();

  form = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    comment: new FormControl<string>(''),
    dateTime: new FormControl<string>('', [Validators.required]),
  });

  ngOnInit(): void {
    this.form.patchValue({
      ...this.emotion(),
      dateTime: this.emotion().dateTime.toISOString(),
    });
  }

  close(role: ModalRole, data?: Omit<Emotion, 'id'>): void {
    this.modalController.dismiss(data, role);
  }

  confirmCreation(): void {
    const entity: Omit<Emotion, 'id'> = {
      name: this.form.value.name ?? '',
      comment: this.form.value.comment || undefined,
      dateTime: new Date(this.form.value.dateTime ?? ''),
    };

    this.close(ModalRole.Confirm, entity);
  }
}
