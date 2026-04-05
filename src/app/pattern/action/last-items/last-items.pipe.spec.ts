import { LastItemsPipe } from './last-items.pipe';

const MOCK_ITEMS: number[] = [1, 2, 3, 4, 5];

describe('LastItemsPipe', () => {
  function createPipe(): LastItemsPipe {
    return new LastItemsPipe();
  }

  it('should return empty array when input array is empty', () => {
    const pipe = createPipe();

    expect(pipe.transform<number>([], 3)).toEqual([]);
  });

  it('should return all items when take equals array length', () => {
    const pipe = createPipe();

    expect(pipe.transform<number>(MOCK_ITEMS, MOCK_ITEMS.length)).toEqual(MOCK_ITEMS);
  });

  it('should return last N items', () => {
    const pipe = createPipe();

    expect(pipe.transform<number>(MOCK_ITEMS, 3)).toEqual([3, 4, 5]);
  });

  it('should return last single item', () => {
    const pipe = createPipe();

    expect(pipe.transform<number>(MOCK_ITEMS, 1)).toEqual([5]);
  });

  it('should return all items when take exceeds array length', () => {
    const pipe = createPipe();

    expect(pipe.transform<number>(MOCK_ITEMS, 10)).toEqual(MOCK_ITEMS);
  });

  it('should preserve the order of items', () => {
    const pipe = createPipe();
    const result = pipe.transform<number>(MOCK_ITEMS, 3);

    expect(result[0]).toBe(MOCK_ITEMS.at(-3));
    expect(result[1]).toBe(MOCK_ITEMS.at(-2));
    expect(result[2]).toBe(MOCK_ITEMS.at(-1));
  });
});
