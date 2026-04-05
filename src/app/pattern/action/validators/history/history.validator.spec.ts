import { FormControl, ValidatorFn } from '@angular/forms';
import { historyValidator } from './history.validator';

const VALID_DATES: string[] = ['10.01.2024', '15.01.2024', '20.01.2024'];
const INVALID_DATES: string[] = ['10.01.2024', '15.01.2024', '10.01.2024'];

describe('historyValidator', () => {
  function createValidator(): ValidatorFn {
    return historyValidator();
  }

  it('should return null for null value', () => {
    const validator = createValidator();
    const control = new FormControl<string[] | null>(null);

    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return null for empty array', () => {
    const validator = createValidator();
    const control = new FormControl<string[]>([]);

    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return null when all dates are unique', () => {
    const validator = createValidator();
    const control = new FormControl<string[]>(VALID_DATES);

    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return null for a single date', () => {
    const validator = createValidator();
    const control = new FormControl<string[]>(['10.01.2024']);

    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return validation error when dates contain duplicates', () => {
    const validator = createValidator();
    const control = new FormControl<string[]>(INVALID_DATES);

    const result = validator(control);
    expect(result).toEqual({ 'history-has-repetition': 'Есть одинаковые даты' });
  });

  it('should return validation error when all dates are identical', () => {
    const validator = createValidator();
    const control = new FormControl<string[]>(['10.01.2024', '10.01.2024']);

    const result = validator(control);
    expect(result).toEqual({ 'history-has-repetition': 'Есть одинаковые даты' });
  });
});
