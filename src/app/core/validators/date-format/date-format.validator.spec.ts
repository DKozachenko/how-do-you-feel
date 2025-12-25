import { FormControl, ValidatorFn } from '@angular/forms';
import { MAIN_DATE_FORMAT, MAIN_DATETIME_FORMAT } from '../../model/main-date-format.constant';
import { dateFormatValidator } from './date-format.validator';

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
      validValues: ['10.11.2015', '24.01.2023', '12.12.2025'],
      invalidValues: ['40.40.2025', '34 dsfsd', '2025.02.34'],
    },
  ],
  [
    MAIN_DATETIME_FORMAT,
    {
      nullValue: null,
      emptyValue: '',
      validValues: ['10.11.2015 13:00', '24.01.2023 07:07', '12.12.2025 23:59'],
      invalidValues: ['12.03.2025 4342', '16.05.2013 34:34', '13.04.2025 :3422'],
    },
  ],
]);

describe('dateFormatValidator', () => {
  function createValidator(format: string): ValidatorFn {
    return dateFormatValidator(format);
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
          'incorrect-date': `Несоответствие формату: ${format}`,
        });
      },
    );
  });
});
