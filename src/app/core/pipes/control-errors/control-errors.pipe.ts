import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';

@Pipe({
  name: 'controlErrorPipe',
  pure: false,
})
export class ControlErrorPipe implements PipeTransform {
  transform(control: AbstractControl<unknown>): string | undefined {
    if (control instanceof FormArray) {
      const arrayErrors = control.controls.map((arrayControl) => ({
        value: arrayControl.value,
        errorText: this.transform(arrayControl),
      }));

      const controlsWithError = arrayErrors.filter((arrayControlInfo) => arrayControlInfo.errorText);
      if (controlsWithError.length < 1) {
        return undefined;
      }

      const { errorText, value } = controlsWithError[0];

      return `${errorText}: ${value}`;
    }

    const errors = control.errors;

    if (!errors) {
      return undefined;
    }

    if (errors['required']) {
      return 'Это поле является обязательным';
    }

    if (errors['min']) {
      return `Минимальное значение ${errors['min']['min']}`;
    }

    if (errors['max']) {
      return `Максимальное значение ${errors['max']['max']}`;
    }

    if (errors['incorrect-date']) {
      return errors['incorrect-date'];
    }

    if (errors['future-date']) {
      return errors['future-date'];
    }

    return undefined;
  }
}
