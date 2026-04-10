import { ActionOrder } from '../../model/action-order.constants';
import { Action } from '../../model/action.interface';
import { SortActionsPipe } from './sort-actions.pipe';

const MOCK_ACTIONS: Action[] = [
  {
    id: '1',
    name: 'Play football',
    rate: 8,
    comment: 'Love playing with friends',
    history: [new Date(2024, 0, 10), new Date(2024, 0, 20)],
    private: false,
  },
  {
    id: '2',
    name: 'Read books',
    rate: 9,
    comment: 'Fantasy and detective stories',
    history: [new Date(2024, 0, 15)],
    private: false,
  },
  {
    id: '3',
    name: 'Walk in the park',
    rate: 7,
    history: [new Date(2024, 0, 5), new Date(2024, 0, 25)],
    private: false,
  },
  {
    id: '4',
    name: 'Watch movies',
    rate: 8,
    comment: 'Especially comedies',
    history: [new Date(2024, 0, 5)],
    private: false,
  },
  {
    id: '5',
    name: 'Play board games',
    rate: 3,
    history: [new Date(2024, 0, 1)],
    private: false,
  },
];

describe('SortActionsPipe', () => {
  function createPipe(): SortActionsPipe {
    return new SortActionsPipe();
  }

  it('should return actions as-is for DEFAULT_ORDER', () => {
    const pipe = createPipe();

    expect(pipe.transform(MOCK_ACTIONS, ActionOrder.DEFAULT_ORDER)).toEqual(MOCK_ACTIONS);
  });

  it('should return empty array for DEFAULT_ORDER when actions array is empty', () => {
    const pipe = createPipe();

    expect(pipe.transform([], ActionOrder.DEFAULT_ORDER)).toEqual([]);
  });

  it('should sort actions by most recent history date descending for FRESHNESS_ORDER', () => {
    const pipe = createPipe();
    const result = pipe.transform([...MOCK_ACTIONS], ActionOrder.FRESHNESS_ORDER);

    expect(result[0]).toEqual(MOCK_ACTIONS[2]); // 2024-01-25
    expect(result[1]).toEqual(MOCK_ACTIONS[0]); // 2024-01-20
    expect(result[2]).toEqual(MOCK_ACTIONS[1]); // 2024-01-15
    expect(result[3]).toEqual(MOCK_ACTIONS[3]); // 2024-01-05
    expect(result[4]).toEqual(MOCK_ACTIONS[4]); // 2024-01-01
  });

  it('should return empty array for FRESHNESS_ORDER when actions array is empty', () => {
    const pipe = createPipe();

    expect(pipe.transform([], ActionOrder.FRESHNESS_ORDER)).toEqual([]);
  });
});
