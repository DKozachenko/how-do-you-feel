import { Action } from '../../model/action.interface';
import { FilterActionsPipe } from './filter-actions.pipe';

const MOCK_ACTIONS: Action[] = [
  {
    id: '1',
    name: 'Play football',
    rate: 8,
    comment: 'Love playing with friends',
    history: [],
    private: false,
  },
  {
    id: '2',
    name: 'Read books',
    rate: 9,
    comment: 'Fantasy and detective stories',
    history: [],
    private: false,
  },
  {
    id: '3',
    name: 'Walk in the park',
    rate: 7,
    history: [],
    private: false,
  },
  {
    id: '4',
    name: 'Watch movies',
    rate: 8,
    comment: 'Especially comedies',
    history: [],
    private: false,
  },
  {
    id: '5',
    name: 'Play board games',
    rate: 3,
    history: [],
    private: false,
  },
];

describe('FilterActionsPipe', () => {
  function createPipe(): FilterActionsPipe {
    return new FilterActionsPipe();
  }

  it('should return empty array when actions array is empty', () => {
    const pipe = createPipe();

    expect(pipe.transform([], 'search')).toEqual([]);
  });

  it('should return all actions when searchInput is empty', () => {
    const pipe = createPipe();

    expect(pipe.transform(MOCK_ACTIONS, '')).toEqual(MOCK_ACTIONS);
  });

  it('should filter actions by name', () => {
    const pipe = createPipe();

    expect(pipe.transform(MOCK_ACTIONS, 'books')).toEqual([MOCK_ACTIONS[1]]);
  });

  it('should filter actions by comment', () => {
    const pipe = createPipe();

    expect(pipe.transform(MOCK_ACTIONS, 'comedies')).toEqual([MOCK_ACTIONS[3]]);
  });

  it('should filter actions case-insensitively', () => {
    const pipe = createPipe();

    expect(pipe.transform(MOCK_ACTIONS, 'FOOTBALL')).toEqual([MOCK_ACTIONS[0]]);
  });

  it('should return multiple matching actions', () => {
    const pipe = createPipe();

    expect(pipe.transform(MOCK_ACTIONS, 'play')).toHaveLength(2);
    expect(pipe.transform(MOCK_ACTIONS, 'play')).toContain(MOCK_ACTIONS[0]);
    expect(pipe.transform(MOCK_ACTIONS, 'play')).toContain(MOCK_ACTIONS[4]);
  });

  it('should return empty array when no actions match searchInput', () => {
    const pipe = createPipe();

    expect(pipe.transform(MOCK_ACTIONS, 'xyz123nonexistent')).toEqual([]);
  });
});
