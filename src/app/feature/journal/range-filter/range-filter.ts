import { ChangeDetectionStrategy, Component, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonDatetime, IonDatetimeButton, IonIcon, IonModal } from '@ionic/angular/standalone';

const INITIAL_FROM = new Date(new Date().setMonth(new Date().getMonth() - 1));
const INITIAL_TO = new Date();

@Component({
  selector: 'app-range-filter',
  templateUrl: './range-filter.html',
  styleUrl: './range-filter.scss',
  imports: [IonDatetime, IonDatetimeButton, IonModal, IonButton, ReactiveFormsModule, FormsModule, IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeFilter implements OnInit {
  form = new FormGroup({
    from: new FormControl<string>(INITIAL_FROM.toISOString(), [Validators.required]),
    to: new FormControl<string>(INITIAL_TO.toISOString(), [Validators.required]),
  });

  apply = output<[Date, Date]>();

  ngOnInit(): void {
    this.emitApply();
  }

  emitApply(): void {
    if (!this.form.value.from || !this.form.value.to) {
      return;
    }

    this.apply.emit([this.getDateWithoutTime(this.form.value.from), this.getDateWithoutTime(this.form.value.to)]);
  }

  setInitialValues(): void {
    this.form.setValue({
      from: INITIAL_FROM.toISOString(),
      to: INITIAL_TO.toISOString(),
    });
    this.emitApply();
  }

  private getDateWithoutTime(dateTime: string): Date {
    const date = new Date(dateTime);
    const dateYear = date.getFullYear();
    const dateMonth = date.getMonth();
    const dateDay = date.getDate();

    return new Date(dateYear, dateMonth, dateDay);
  }
}
