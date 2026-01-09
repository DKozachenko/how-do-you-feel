import { Emotion } from '../../../core/model/emotion.interface';
import { SortByDatesPipe } from './sort-by-dates.pipe';

const MOCK_EMOTIONS: Emotion[] = [
  {
    id: '1',
    name: 'Happy',
    comment: 'Morning joy',
    color: 'green',
    dateTime: new Date(2024, 0, 15, 9, 0),
    private: false,
  },
  {
    id: '2',
    name: 'Calm',
    comment: 'Afternoon peace',
    color: 'blue',
    dateTime: new Date(2024, 0, 15, 14, 0),
    private: false,
  },
  {
    id: '3',
    name: 'Excited',
    comment: 'New year celebration',
    color: 'yellow',
    dateTime: new Date(2024, 0, 1),
    private: false,
  },
  {
    id: '4',
    name: 'Grateful',
    comment: 'End of month reflection',
    color: 'purple',
    dateTime: new Date(2024, 0, 31),
    private: false,
  },
  {
    id: '5',
    name: 'Anxious',
    comment: 'Mid-month stress',
    color: 'orange',
    dateTime: new Date(2024, 1, 15),
    private: false,
  },
];

describe('SortByDatesPipe', () => {
  function createPipe(): SortByDatesPipe {
    return new SortByDatesPipe();
  }

  it('should return empty map when input map is empty', () => {
    const pipe = createPipe();
    const emptyMap = new Map<string, Emotion[]>();

    expect(pipe.transform(emptyMap).size).toBe(0);
  });

  it('should return map with single entry', () => {
    const pipe = createPipe();
    const singleEntryMap = new Map<string, Emotion[]>([['15.01.2024', [MOCK_EMOTIONS[0]]]]);

    const result = pipe.transform(singleEntryMap);

    expect(result.size).toBe(1);
    expect(result.has('15.01.2024')).toBe(true);
  });

  it('should sort dates in descending order (newest first)', () => {
    const pipe = createPipe();
    const unsortedMap = new Map<string, Emotion[]>([
      ['01.01.2024', [MOCK_EMOTIONS[2]]],
      ['31.01.2024', [MOCK_EMOTIONS[3]]],
      ['15.01.2024', [MOCK_EMOTIONS[0], MOCK_EMOTIONS[1]]],
    ]);

    const result = pipe.transform(unsortedMap);
    const keys = Array.from(result.keys());

    expect(keys).toEqual(['31.01.2024', '15.01.2024', '01.01.2024']);
  });

  it('should sort dates across different months', () => {
    const pipe = createPipe();
    const unsortedMap = new Map<string, Emotion[]>([
      ['15.01.2024', [MOCK_EMOTIONS[0]]],
      ['15.02.2024', [MOCK_EMOTIONS[4]]],
      ['01.01.2024', [MOCK_EMOTIONS[2]]],
    ]);

    const result = pipe.transform(unsortedMap);
    const keys = Array.from(result.keys());

    expect(keys).toEqual(['15.02.2024', '15.01.2024', '01.01.2024']);
  });

  it('should sort dates across different years', () => {
    const pipe = createPipe();
    const unsortedMap = new Map<string, Emotion[]>([
      ['01.01.2023', [MOCK_EMOTIONS[0]]],
      ['01.01.2025', [MOCK_EMOTIONS[1]]],
      ['01.01.2024', [MOCK_EMOTIONS[2]]],
    ]);

    const result = pipe.transform(unsortedMap);
    const keys = Array.from(result.keys());

    expect(keys).toEqual(['01.01.2025', '01.01.2024', '01.01.2023']);
  });

  it('should keep emotion data after sorting', () => {
    const pipe = createPipe();
    const unsortedMap = new Map<string, Emotion[]>([
      ['01.01.2024', [MOCK_EMOTIONS[2]]],
      ['15.01.2024', [MOCK_EMOTIONS[0], MOCK_EMOTIONS[1]]],
    ]);

    const result = pipe.transform(unsortedMap);

    expect(result.get('01.01.2024')).toEqual([MOCK_EMOTIONS[2]]);
    expect(result.get('15.01.2024')).toEqual([MOCK_EMOTIONS[0], MOCK_EMOTIONS[1]]);
  });

  it('should not change already sorted map', () => {
    const pipe = createPipe();
    const sortedMap = new Map<string, Emotion[]>([
      ['31.01.2024', [MOCK_EMOTIONS[3]]],
      ['15.01.2024', [MOCK_EMOTIONS[0]]],
      ['01.01.2024', [MOCK_EMOTIONS[2]]],
    ]);

    const result = pipe.transform(sortedMap);
    const keys = Array.from(result.keys());

    expect(keys).toEqual(['31.01.2024', '15.01.2024', '01.01.2024']);
  });
});
