import { Emotion } from '../../../core/model/emotion.interface';
import { SortByTimePipe } from './sort-by-time.pipe';

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
    dateTime: new Date(2024, 0, 15, 14, 30),
    private: false,
  },
  {
    id: '3',
    name: 'Excited',
    comment: 'Evening excitement',
    color: 'yellow',
    dateTime: new Date(2024, 0, 15, 20, 0),
    private: false,
  },
  {
    id: '4',
    name: 'Grateful',
    comment: 'Night reflection',
    color: 'purple',
    dateTime: new Date(2024, 0, 15, 23, 45),
    private: false,
  },
  {
    id: '5',
    name: 'Anxious',
    comment: 'Early morning stress',
    color: 'orange',
    dateTime: new Date(2024, 0, 15, 6, 15),
    private: false,
  },
];

describe('SortByTimePipe', () => {
  function createPipe(): SortByTimePipe {
    return new SortByTimePipe();
  }

  it('should return empty array when input array is empty', () => {
    const pipe = createPipe();

    expect(pipe.transform([])).toEqual([]);
  });

  it('should return array with single emotion', () => {
    const pipe = createPipe();

    expect(pipe.transform([MOCK_EMOTIONS[0]])).toEqual([MOCK_EMOTIONS[0]]);
  });

  it('should sort emotions in descending order by time (newest first)', () => {
    const pipe = createPipe();
    const unsortedEmotions = [MOCK_EMOTIONS[0], MOCK_EMOTIONS[2], MOCK_EMOTIONS[1]];

    expect(pipe.transform(unsortedEmotions)).toEqual([MOCK_EMOTIONS[2], MOCK_EMOTIONS[1], MOCK_EMOTIONS[0]]);
  });

  it('should sort all emotions correctly', () => {
    const pipe = createPipe();
    const unsortedEmotions = [MOCK_EMOTIONS[0], MOCK_EMOTIONS[4], MOCK_EMOTIONS[2], MOCK_EMOTIONS[1], MOCK_EMOTIONS[3]];

    expect(pipe.transform(unsortedEmotions)).toEqual([
      MOCK_EMOTIONS[3],
      MOCK_EMOTIONS[2],
      MOCK_EMOTIONS[1],
      MOCK_EMOTIONS[0],
      MOCK_EMOTIONS[4],
    ]);
  });

  it('should not change already sorted array', () => {
    const pipe = createPipe();
    const sortedEmotions = [MOCK_EMOTIONS[3], MOCK_EMOTIONS[2], MOCK_EMOTIONS[1]];

    expect(pipe.transform(sortedEmotions)).toEqual([MOCK_EMOTIONS[3], MOCK_EMOTIONS[2], MOCK_EMOTIONS[1]]);
  });

  it('should sort emotions across different dates', () => {
    const pipe = createPipe();
    const emotionsAcrossDates: Emotion[] = [
      { ...MOCK_EMOTIONS[0], dateTime: new Date(2024, 0, 14, 12, 0) },
      { ...MOCK_EMOTIONS[1], dateTime: new Date(2024, 0, 16, 8, 0) },
      { ...MOCK_EMOTIONS[2], dateTime: new Date(2024, 0, 15, 10, 0) },
    ];

    const result = pipe.transform(emotionsAcrossDates);

    expect(result[0].dateTime).toEqual(new Date(2024, 0, 16, 8, 0));
    expect(result[1].dateTime).toEqual(new Date(2024, 0, 15, 10, 0));
    expect(result[2].dateTime).toEqual(new Date(2024, 0, 14, 12, 0));
  });
});
