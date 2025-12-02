import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isValid, parse } from 'date-fns';
import { MAIN_DATE_FORMAT } from '@core/model/main-date-format.constant';

export function dateFormatValidator(): ValidatorFn {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    const dateStr = control.value;

    if (!dateStr) {
      return null;
    }

    try {
      const parsedDate = parse(dateStr, MAIN_DATE_FORMAT, new Date());

      if (!isValid(parsedDate)) {
        return { 'incorrect-date': true };
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return { 'incorrect-date': true };
    }

    return null;
  };
}
