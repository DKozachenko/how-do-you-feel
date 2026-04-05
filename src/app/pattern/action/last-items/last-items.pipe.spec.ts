import { LastItemsPipe } from './last-items.pipe';

const MOCK_DATES: Date[] = [
  new Date(2024, 0, 10, 12, 0),
  new Date(2024, 0, 15, 9, 0),
  new Date(2024, 0, 15, 14, 30),
  new Date(2024, 0, 15, 20, 0),
  new Date(2024, 0, 20, 8, 0),
];

describe('LastItemsPipe', () => {
  function createPipe(): LastItemsPipe {
    return new LastItemsPipe();
  }

  it('should return empty array when input array is empty', () => {
    const pipe = createPipe();

    expect(pipe.transform([], 3)).toEqual([]);
  });

  it('should return all dates when take equals array length', () => {
    const pipe = createPipe();

    expect(pipe.transform(MOCK_DATES, MOCK_DATES.length)).toEqual(MOCK_DATES);
  });

  it('should return last N dates', () => {
    const pipe = createPipe();

    expect(pipe.transform(MOCK_DATES, 3)).toEqual([MOCK_DATES[2], MOCK_DATES[3], MOCK_DATES[4]]);
  });

  it('should return last single date', () => {
    const pipe = createPipe();

    expect(pipe.transform(MOCK_DATES, 1)).toEqual([MOCK_DATES[4]]);
  });

  it('should return all dates when take exceeds array length', () => {
    const pipe = createPipe();

    expect(pipe.transform(MOCK_DATES, 10)).toEqual(MOCK_DATES);
  });

  it('should preserve the order of dates', () => {
    const pipe = createPipe();
    const result = pipe.transform(MOCK_DATES, 3);

    expect(result[0]).toEqual(MOCK_DATES[2]);
    expect(result[1]).toEqual(MOCK_DATES[3]);
    expect(result[2]).toEqual(MOCK_DATES[4]);
  });
});
