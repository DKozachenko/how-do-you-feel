import { SortDatesPipe } from './sort-dates.pipe';

const MOCK_DATES: Date[] = [
  new Date(2024, 0, 15, 9, 0),
  new Date(2024, 0, 15, 14, 30),
  new Date(2024, 0, 15, 20, 0),
  new Date(2024, 0, 10, 12, 0),
  new Date(2024, 0, 20, 8, 0),
];

describe('SortDatesPipe', () => {
  function createPipe(): SortDatesPipe {
    return new SortDatesPipe();
  }

  it('should return empty array when input array is empty', () => {
    const pipe = createPipe();

    expect(pipe.transform([])).toEqual([]);
  });

  it('should return array with single date', () => {
    const pipe = createPipe();

    expect(pipe.transform([MOCK_DATES[0]])).toEqual([MOCK_DATES[0]]);
  });

  it('should sort dates in ascending order (oldest first)', () => {
    const pipe = createPipe();
    const unsortedDates = [MOCK_DATES[2], MOCK_DATES[0], MOCK_DATES[1]];

    expect(pipe.transform(unsortedDates)).toEqual([MOCK_DATES[0], MOCK_DATES[1], MOCK_DATES[2]]);
  });

  it('should sort all dates correctly', () => {
    const pipe = createPipe();
    const unsortedDates = [MOCK_DATES[0], MOCK_DATES[4], MOCK_DATES[3], MOCK_DATES[2], MOCK_DATES[1]];

    expect(pipe.transform(unsortedDates)).toEqual([
      MOCK_DATES[3],
      MOCK_DATES[0],
      MOCK_DATES[1],
      MOCK_DATES[2],
      MOCK_DATES[4],
    ]);
  });

  it('should not change already sorted array', () => {
    const pipe = createPipe();
    const sortedDates = [MOCK_DATES[3], MOCK_DATES[0], MOCK_DATES[1]];

    expect(pipe.transform(sortedDates)).toEqual([MOCK_DATES[3], MOCK_DATES[0], MOCK_DATES[1]]);
  });

  it('should sort dates across different months', () => {
    const pipe = createPipe();
    const datesAcrossMonths = [new Date(2024, 2, 15), new Date(2024, 0, 15), new Date(2024, 1, 15)];

    const result = pipe.transform(datesAcrossMonths);

    expect(result[0]).toEqual(new Date(2024, 0, 15));
    expect(result[1]).toEqual(new Date(2024, 1, 15));
    expect(result[2]).toEqual(new Date(2024, 2, 15));
  });

  it('should sort dates across different years', () => {
    const pipe = createPipe();
    const datesAcrossYears = [new Date(2025, 0, 1), new Date(2023, 0, 1), new Date(2024, 0, 1)];

    const result = pipe.transform(datesAcrossYears);

    expect(result[0]).toEqual(new Date(2023, 0, 1));
    expect(result[1]).toEqual(new Date(2024, 0, 1));
    expect(result[2]).toEqual(new Date(2025, 0, 1));
  });
});
