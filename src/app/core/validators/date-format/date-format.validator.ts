import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isValid, parse } from 'date-fns';

export function dateFormatValidator(format: string): ValidatorFn {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    const dateStr = control.value;

    if (!dateStr) {
      return null;
    }

    try {
      const parsedDate = parse(dateStr, format, new Date());

      if (!isValid(parsedDate)) {
        return { 'incorrect-date': `Дата должна соответствовать формату: ${format}` };
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return { 'incorrect-date': `Дата должна соответствовать формату: ${format}` };
    }

    return null;
  };
}
