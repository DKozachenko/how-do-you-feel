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
  IonNote,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { format, parse } from 'date-fns';
import { Emotion } from '@core/model/emotion.interface';
import { MAIN_DATETIME_FORMAT } from '@core/model/main-date-format.constant';
import { ModalRole } from '@core/model/modal-role.enum';
import { ControlErrorPipe } from '@core/pipes/control-errors/control-errors.pipe';
import { dateFormatValidator } from '@core/validators/date-format/date-format.validator';
import { futureDateValidator } from '@core/validators/future-date/future-date.validator';
import { CssColorsHintButton } from '@pattern/css-colors-hint/css-colors-hint-button/css-colors-hint-button';
import { EmotionHintButton } from '@pattern/emotions-hint/emotion-hint-button/emotion-hint-button';

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
    EmotionHintButton,
    CssColorsHintButton,
    ControlErrorPipe,
    IonNote,
    IonToggle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditEmotionModal implements OnInit {
  private readonly modalController = inject(ModalController);

  protected readonly ModalRole = ModalRole;

  emotion = input.required<Emotion>();

  form = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    color: new FormControl<string>('', [Validators.required]),
    comment: new FormControl<string>(''),
    private: new FormControl<boolean>(false, [Validators.required]),
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
    this.form.updateValueAndValidity();
  }

  close(role: ModalRole, data?: Omit<Emotion, 'id'>): void {
    this.modalController.dismiss(data, role);
  }

  confirmEdit(): void {
    const entity: Omit<Emotion, 'id'> = {
      name: this.form.value.name ?? '',
      color: this.form.value.color ?? '',
      comment: this.form.value.comment || undefined,
      private: this.form.value.private || false,
      dateTime: new Date(parse(this.form.value.dateTime ?? '', MAIN_DATETIME_FORMAT, new Date())),
    };

    this.close(ModalRole.Confirm, entity);
  }
}
