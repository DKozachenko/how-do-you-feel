import { FormArray, FormControl, Validators } from '@angular/forms';
import { ControlErrorPipe } from './control-errors.pipe';

describe('ControlErrorPipe', () => {
  function createPipe(): ControlErrorPipe {
    return new ControlErrorPipe();
  }

  describe('FormControl', () => {
    it('should return undefined when FormControl has legal value', () => {
      const control = new FormControl('value');
      const pipe = createPipe();

      expect(pipe.transform(control)).toBeUndefined();
    });

    it('should return undefined when FormControl errors is null', () => {
      const control = new FormControl('value');
      control.setErrors(null);

      const pipe = createPipe();

      expect(pipe.transform(control)).toBeUndefined();
    });

    it('should return required error message when FormControl is empty', () => {
      const control = new FormControl('', Validators.required);
      const pipe = createPipe();

      expect(pipe.transform(control)).toBe('Это поле является обязательным');
    });

    it('should return min error message when FormControl value is lower than minimum value', () => {
      const control = new FormControl(5, Validators.min(10));
      const pipe = createPipe();

      expect(pipe.transform(control)).toBe('Минимальное значение 10');
    });

    it('should return max error message when FormControl value is bigger than maximum value', () => {
      const control = new FormControl(15, Validators.max(10));
      const pipe = createPipe();

      expect(pipe.transform(control)).toBe('Максимальное значение 10');
    });

    it('should return incorrect-date error message when FormControl value has date with incorrect format', () => {
      const errorMessage = 'Несоответствие формату: dd.MM.yyyy';
      const control = new FormControl('invalid-date');
      control.setErrors({ 'incorrect-date': errorMessage });

      const pipe = createPipe();
      expect(pipe.transform(control)).toBe(errorMessage);
    });

    it('should return future-date error message when FormControl value has future date', () => {
      const errorMessage = 'Дата не может быть в будущем';
      const control = new FormControl('future-date-value');
      control.setErrors({ 'future-date': errorMessage });

      const pipe = createPipe();
      expect(pipe.transform(control)).toBe(errorMessage);
    });

    it('should return undefined for unknown error type', () => {
      const control = new FormControl('value');
      control.setErrors({ unknownError: 'some error' });

      const pipe = createPipe();
      expect(pipe.transform(control)).toBeUndefined();
    });
  });

  describe('FormArray', () => {
    it('should return undefined when FormArray has no errors in controls', () => {
      const formArray = new FormArray([
        new FormControl('value1'),
        new FormControl('value2'),
        new FormControl('value3'),
      ]);

      const pipe = createPipe();
      expect(pipe.transform(formArray)).toBeUndefined();
    });

    it('should return error of first control when FormArray has few controls with errors', () => {
      const formArray = new FormArray([
        new FormControl('valid1'),
        new FormControl('valid2'),
        new FormControl(5, Validators.min(10)),
        new FormControl('valid3'),
        new FormControl(10, Validators.min(20)),
      ]);

      const pipe = createPipe();

      expect(pipe.transform(formArray)).toBe('Минимальное значение 10: 5');
    });

    it('should return undefined for empty FormArray', () => {
      const formArray = new FormArray([]);

      const pipe = createPipe();
      expect(pipe.transform(formArray)).toBeUndefined();
    });
  });
});
