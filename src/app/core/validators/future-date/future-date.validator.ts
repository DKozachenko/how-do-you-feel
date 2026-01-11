import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isValid, parse } from 'date-fns';

export function futureDateValidator(format: string): ValidatorFn {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    const dateStr = control.value;

    if (!dateStr) {
      return null;
    }

    try {
      const parsedDate = parse(dateStr, format, new Date());

      if (!isValid(parsedDate)) {
        return { 'incorrect-date': `Несоответствие формату: ${format}` };
      }

      if (parsedDate > new Date()) {
        return { 'future-date': 'Дата не может быть в будущем' };
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return { 'future-date': 'Дата не может быть в будущем' };
    }

    return null;
  };
}
