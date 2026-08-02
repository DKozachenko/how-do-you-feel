import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Action } from '@core/model/action.interface';
import { MAIN_DATE_FORMAT } from '@core/model/main-date-format.constant';
import { ModalRole } from '@core/model/modal-role.enum';
import { ControlErrorPipe } from '@core/pipes/control-errors/control-errors.pipe';
import { dateFormatValidator } from '@core/validators/date-format/date-format.validator';
import { futureDateValidator } from '@core/validators/future-date/future-date.validator';
import { LastItemsPipe } from '../last-items/last-items.pipe';
import { LAST_N_HISTORY_ITEMS } from '../model/last-n-history-items.constant';
import { historyValidator } from '../validators/history/history.validator';

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
    ControlErrorPipe,
    IonNote,
    IonToggle,
    LastItemsPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditActionModal implements OnInit {
  private readonly modalController = inject(ModalController);

  protected readonly ModalRole = ModalRole;
  protected readonly LAST_N_HISTORY_ITEMS = LAST_N_HISTORY_ITEMS;

  action = input.required<Action>();

  form = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    rate: new FormControl<number>(1, [Validators.required, Validators.min(0), Validators.max(10)]),
    comment: new FormControl<string>(''),
    private: new FormControl<boolean>(false, [Validators.required]),
    history: new FormArray<FormControl<string>>([]),
  });

  showAllHistoryControls = signal(false);

  get historyFormArray(): FormArray<FormControl<string>> {
    return this.form.controls.history;
  }

  ngOnInit(): void {
    if (this.action()) {
      this.form.patchValue({
        name: this.action().name,
        rate: this.action().rate,
        comment: this.action().comment,
        private: this.action().private,
      });

      this.form.controls.history.addValidators([Validators.required, historyValidator()]);

      this.action().history.forEach((date) => {
        this.addDateControl(format(date, MAIN_DATE_FORMAT));
      });

      this.form.updateValueAndValidity();
    }
  }

  close(role: ModalRole, data?: Omit<Action, 'id'>): void {
    this.modalController.dismiss(data, role);
  }

  toggleShowAllHistoryControls(): void {
    this.showAllHistoryControls.update((v) => !v);
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
    this.historyFormArray.markAsTouched();
    this.historyFormArray.updateValueAndValidity();
  }

  removeDateControl(index: number): void {
    this.historyFormArray.removeAt(index);
    this.historyFormArray.markAsTouched();
    this.historyFormArray.updateValueAndValidity();
  }

  confirmCreation(): void {
    const entityWithoutHistory: Omit<Action, 'id' | 'history'> = {
      name: this.form.value.name?.trim() ?? '',
      rate: this.form.value.rate ?? 0,
      comment: this.form.value.comment?.trim() || undefined,
      private: this.form.value.private ?? false,
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
