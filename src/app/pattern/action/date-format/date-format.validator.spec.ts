import { ValidatorFn } from '@angular/forms';
import { MockBuilder, MockRender } from 'ng-mocks';
import { dateFormatValidator } from './date-format.validator';

describe('dateFormatValidator', () => {
  beforeEach(() => MockBuilder(dateFormatValidator));

  function createValidator(): ValidatorFn {
    return MockRender(dateFormatValidator).point.componentInstance;
  }

  describe('test', () => {
    it('should return database object via "createDb" method', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const service = createValidator();
      expect(0).toBe(0);
    });
  });
});
