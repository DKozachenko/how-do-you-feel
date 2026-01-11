import { Emotion } from '../../../core/model/emotion.interface';
import { FilterByRangePipe } from './filter-by-range.pipe';

const MOCK_EMOTIONS: Emotion[] = [
  {
    id: '1',
    name: 'Happy',
    comment: 'Feeling great',
    color: 'green',
    dateTime: new Date(2024, 0, 1, 9, 0),
    private: false,
  },
  {
    id: '2',
    name: 'Calm',
    comment: 'Relaxed morning',
    color: 'blue',
    dateTime: new Date(2024, 0, 1, 14, 0),
    private: false,
  },
  {
    id: '3',
    name: 'Excited',
    comment: 'Big news',
    color: 'yellow',
    dateTime: new Date(2024, 0, 15),
    private: false,
  },
  {
    id: '4',
    name: 'Anxious',
    comment: 'Busy day',
    color: 'orange',
    dateTime: new Date(2024, 1, 1, 10, 0),
    private: false,
  },
  {
    id: '5',
    name: 'Grateful',
    comment: 'Evening reflection',
    color: 'purple',
    dateTime: new Date(2024, 1, 1, 20, 0),
    private: false,
  },
];

const MOCK_EMOTIONS_MAP: Map<string, Emotion[]> = new Map([
  ['01.01.2024', [MOCK_EMOTIONS[0], MOCK_EMOTIONS[1]]],
  ['15.01.2024', [MOCK_EMOTIONS[2]]],
  ['01.02.2024', [MOCK_EMOTIONS[3], MOCK_EMOTIONS[4]]],
]);

describe('FilterByRangePipe', () => {
  function createPipe(): FilterByRangePipe {
    return new FilterByRangePipe();
  }

  it('should return original map when range is null', () => {
    const pipe = createPipe();

    expect(pipe.transform(MOCK_EMOTIONS_MAP, null)).toBe(MOCK_EMOTIONS_MAP);
  });

  it('should return empty map when no dates fall within range', () => {
    const pipe = createPipe();
    const range: [Date, Date] = [new Date(2025, 0, 1), new Date(2025, 11, 31)];

    expect(pipe.transform(MOCK_EMOTIONS_MAP, range).size).toBe(0);
  });

  it('should return all entries when range covers all dates', () => {
    const pipe = createPipe();
    const range: [Date, Date] = [new Date(2024, 0, 1), new Date(2024, 1, 1)];

    expect(pipe.transform(MOCK_EMOTIONS_MAP, range).size).toBe(3);
  });

  it('should filter entries within specific range', () => {
    const pipe = createPipe();
    const range: [Date, Date] = [new Date(2024, 0, 10), new Date(2024, 0, 20)];

    const result = pipe.transform(MOCK_EMOTIONS_MAP, range);

    expect(result.size).toBe(1);
    expect(result.has('15.01.2024')).toBe(true);
  });

  it('should include dates that match range boundaries exactly', () => {
    const pipe = createPipe();
    const range: [Date, Date] = [new Date(2024, 0, 1), new Date(2024, 0, 15)];

    const result = pipe.transform(MOCK_EMOTIONS_MAP, range);

    expect(result.size).toBe(2);
    expect(result.has('01.01.2024')).toBe(true);
    expect(result.has('15.01.2024')).toBe(true);
  });

  it('should return single entry when range matches one date', () => {
    const pipe = createPipe();
    const range: [Date, Date] = [new Date(2024, 0, 15), new Date(2024, 0, 15)];

    const result = pipe.transform(MOCK_EMOTIONS_MAP, range);

    expect(result.size).toBe(1);
    expect(result.has('15.01.2024')).toBe(true);
  });

  it('should return empty map when input map is empty', () => {
    const pipe = createPipe();
    const emptyMap = new Map<string, Emotion[]>();
    const range: [Date, Date] = [new Date(2024, 0, 1), new Date(2024, 11, 31)];

    expect(pipe.transform(emptyMap, range).size).toBe(0);
  });

  it('should keep emotion data in filtered results', () => {
    const pipe = createPipe();
    const range: [Date, Date] = [new Date(2024, 0, 1), new Date(2024, 0, 1)];

    expect(pipe.transform(MOCK_EMOTIONS_MAP, range).get('01.01.2024')).toEqual([MOCK_EMOTIONS[0], MOCK_EMOTIONS[1]]);
  });
});
