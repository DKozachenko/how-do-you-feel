import { FormControl, ValidatorFn } from '@angular/forms';
import { addDays, addMonths, format, subDays, subMonths } from 'date-fns';
import { MAIN_DATE_FORMAT, MAIN_DATETIME_FORMAT } from '../../model/main-date-format.constant';
import { futureDateValidator } from './future-date.validator';

interface TestCases {
  nullValue: null;
  emptyValue: '';
  validValues: string[];
  invalidValues: string[];
}

const DATE_FORMATS_MAP = new Map<string, TestCases>([
  [
    MAIN_DATE_FORMAT,
    {
      nullValue: null,
      emptyValue: '',
      validValues: [
        format(subDays(new Date(), 5), MAIN_DATE_FORMAT),
        format(subMonths(new Date(), 1), MAIN_DATE_FORMAT),
        format(subDays(new Date(), 20), MAIN_DATE_FORMAT),
      ],
      invalidValues: [
        format(addDays(new Date(), 5), MAIN_DATE_FORMAT),
        format(addMonths(new Date(), 1), MAIN_DATE_FORMAT),
        format(addDays(new Date(), 20), MAIN_DATE_FORMAT),
      ],
    },
  ],
  [
    MAIN_DATETIME_FORMAT,
    {
      nullValue: null,
      emptyValue: '',
      validValues: [
        format(subDays(new Date(), 5), MAIN_DATETIME_FORMAT),
        format(subMonths(new Date(), 1), MAIN_DATETIME_FORMAT),
        format(subDays(new Date(), 20), MAIN_DATETIME_FORMAT),
      ],
      invalidValues: [
        format(addDays(new Date(), 5), MAIN_DATETIME_FORMAT),
        format(addMonths(new Date(), 1), MAIN_DATETIME_FORMAT),
        format(addDays(new Date(), 20), MAIN_DATETIME_FORMAT),
      ],
    },
  ],
]);

describe('futureDateValidator', () => {
  function createValidator(format: string): ValidatorFn {
    return futureDateValidator(format);
  }

  describe.each(Array.from(DATE_FORMATS_MAP.entries()))('Format: "%s"', (format, testCases) => {
    it('should return null for null value', () => {
      const validator = createValidator(format);
      const control = new FormControl(testCases.nullValue);

      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const validator = createValidator(format);
      const control = new FormControl(testCases.emptyValue);

      const result = validator(control);
      expect(result).toBeNull();
    });

    test.each(testCases.validValues)('should return null for valid value: %s', (validValue) => {
      const validator = createValidator(format);
      const control = new FormControl(validValue);

      const result = validator(control);
      expect(result).toBeNull();
    });

    test.each(testCases.invalidValues)(
      'should return validation error object for invalid value: %s',
      (invalidValue) => {
        const validator = createValidator(format);
        const control = new FormControl(invalidValue);

        const result = validator(control);
        expect(result).toEqual({
          'future-date': 'Дата не может быть в будущем',
        });
      },
    );
  });
});
