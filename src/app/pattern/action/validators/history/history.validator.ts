import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function historyValidator(): ValidatorFn {
  return (control: AbstractControl<string[] | null>): ValidationErrors | null => {
    const dates = control.value;

    if (!dates) {
      return null;
    }

    if (new Set(dates).size < dates.length) {
      return { 'history-has-repetition': 'Есть одинаковые даты' };
    }

    return null;
  };
}
