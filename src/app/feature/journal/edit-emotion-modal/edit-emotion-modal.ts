import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
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
import { format, parse } from 'date-fns';
import { Emotion } from '@core/model/emotion.interface';
import { MAIN_DATETIME_FORMAT } from '@core/model/main-date-format.constant';
import { ModalRole } from '@core/model/modal-role.enum';
import { dateFormatValidator } from '@core/validators/date-format/date-format.validator';
import { futureDateValidator } from '@core/validators/future-date/future-date.validator';

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
    color: new FormControl<string>(''),
    dateTime: new FormControl<string>('', [
      Validators.required,
      dateFormatValidator(MAIN_DATETIME_FORMAT),
      futureDateValidator(MAIN_DATETIME_FORMAT),
    ]),
  });

  ngOnInit(): void {
    this.form.patchValue({
      ...this.emotion(),
      dateTime: format(this.emotion().dateTime, MAIN_DATETIME_FORMAT),
    });
  }

  close(role: ModalRole, data?: Omit<Emotion, 'id'>): void {
    this.modalController.dismiss(data, role);
  }

  confirmCreation(): void {
    const entity: Omit<Emotion, 'id'> = {
      name: this.form.value.name ?? '',
      comment: this.form.value.comment || undefined,
      color: this.form.value.color ?? '',
      dateTime: new Date(parse(this.form.value.dateTime ?? '', MAIN_DATETIME_FORMAT, new Date())),
    };

    this.close(ModalRole.Confirm, entity);
  }
}
