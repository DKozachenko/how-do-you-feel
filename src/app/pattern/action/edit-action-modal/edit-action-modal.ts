import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Action } from '@core/model/action.interface';
import { MAIN_DATE_FORMAT } from '@core/model/main-date-format.constant';
import { ModalRole } from '@core/model/modal-role.enum';
import { dateFormatValidator } from '@core/validators/date-format/date-format.validator';
import { futureDateValidator } from '@core/validators/future-date/future-date.validator';

@Component({
  selector: 'app-edit-action-modal',
  templateUrl: './edit-action-modal.html',
  styleUrl: './edit-action-modal.scss',
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
export class EditActionModal implements OnInit {
  private readonly modalController = inject(ModalController);

  protected readonly ModalRole = ModalRole;

  action = input.required<Action>();

  form = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    rate: new FormControl<number>(1, [Validators.required, Validators.min(0), Validators.max(10)]),
    comment: new FormControl<string>(''),
    history: new FormArray<FormControl<string>>([]),
  });

  get historyFormArray(): FormArray<FormControl<string>> {
    return this.form.controls.history;
  }

  ngOnInit(): void {
    if (this.action()) {
      this.form.patchValue({
        name: this.action().name,
        rate: this.action().rate,
        comment: this.action().comment,
      });

      this.form.controls.history.addValidators(Validators.required);

      this.action().history.forEach((date) => {
        this.addDateControl(format(date, MAIN_DATE_FORMAT));
      });
    }
  }

  close(role: ModalRole, data?: Omit<Action, 'id'>): void {
    this.modalController.dismiss(data, role);
  }

  addDateControl(initialValue?: string): void {
    this.historyFormArray.push(
      <FormControl<string>>(
        new FormControl<string>(initialValue ?? format(new Date(), MAIN_DATE_FORMAT), [
          Validators.required,
          dateFormatValidator(MAIN_DATE_FORMAT),
          futureDateValidator(MAIN_DATE_FORMAT),
        ])
      ),
    );
  }

  removeDateControl(index: number): void {
    this.historyFormArray.removeAt(index);
  }

  confirmCreation(): void {
    const entityWithoutHistory: Omit<Action, 'id' | 'history'> = {
      name: this.form.value.name ?? '',
      rate: this.form.value.rate ?? 0,
      comment: this.form.value.comment || undefined,
    };

    const entity: Omit<Action, 'id'> = {
      ...entityWithoutHistory,
      history: this.action()
        ? (this.form.value.history ?? []).map((dateStr) => parse(dateStr, MAIN_DATE_FORMAT, new Date()))
        : [new Date()],
    };

    this.close(ModalRole.Confirm, entity);
  }
}
