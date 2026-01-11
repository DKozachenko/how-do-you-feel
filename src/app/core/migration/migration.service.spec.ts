import { MockBuilder, MockRender } from 'ng-mocks';
import { firstValueFrom, of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}));

import { DislikesStorageService } from '../dislikes/dislikes-storage.service';
import { DISLIKES_STORAGE_KEY } from '../dislikes/dislikes.storage-key';
import { EmotionStorageService } from '../emotions/emotions-storage.service';
import { EMOTIONS_STORAGE_KEY } from '../emotions/emotions.storage-key';
import { LikesStorageService } from '../likes/likes-storage.service';
import { LIKES_STORAGE_KEY } from '../likes/likes.storage-key';
import { Action } from '../model/action.interface';
import { Emotion } from '../model/emotion.interface';
import { PRIVATE_FIELD_MIGRATION_KEY } from '../model/migration.constants';
import { IonicStorageService } from '../storage/ionic-storage/ionic-storage.service';
import { MigrationService } from './migration.service';

const MOCK_LIKES_WITHOUT_PRIVATE_FIELD: Omit<Action, 'private'>[] = [
  {
    id: '1',
    name: 'Play football',
    rate: 8,
    comment: 'Love playing with friends',
    history: [new Date(2024, 0, 10), new Date(2024, 0, 15)],
  },
  {
    id: '2',
    name: 'Read books',
    rate: 9,
    comment: 'Fantasy and sci-fi',
    history: [new Date(2024, 0, 5)],
  },
];

const MOCK_DISLIKES_WITHOUT_PRIVATE_FIELD: Omit<Action, 'private'>[] = [
  {
    id: '3',
    name: 'Wake up early',
    rate: 2,
    comment: 'Hate mornings',
    history: [new Date(2024, 0, 1)],
  },
  {
    id: '4',
    name: 'Traffic jams',
    rate: 1,
    history: [],
  },
];

const MOCK_EMOTIONS_WITHOUT_PRIVATE_FIELD: Omit<Emotion, 'private'>[] = [
  {
    id: '5',
    name: 'Happy',
    comment: 'Great day',
    color: 'green',
    dateTime: new Date(2024, 0, 15, 10, 30),
  },
  {
    id: '6',
    name: 'Calm',
    comment: 'Relaxing evening',
    color: 'blue',
    dateTime: new Date(2024, 0, 14, 20, 0),
  },
];

describe('MigrationService', () => {
  function createService(): MigrationService {
    return MockRender(MigrationService).point.componentInstance;
  }

  let mockIonicStorage: IonicStorageService;
  let mockLikesStorage: LikesStorageService;
  let mockDislikesStorage: DislikesStorageService;
  let mockEmotionsStorage: EmotionStorageService;

  beforeEach(() => {
    mockIonicStorage = mock(IonicStorageService);
    mockLikesStorage = mock(LikesStorageService);
    mockDislikesStorage = mock(DislikesStorageService);
    mockEmotionsStorage = mock(EmotionStorageService);

    return MockBuilder(MigrationService)
      .mock(IonicStorageService, instance(mockIonicStorage))
      .mock(LikesStorageService, instance(mockLikesStorage))
      .mock(DislikesStorageService, instance(mockDislikesStorage))
      .mock(EmotionStorageService, instance(mockEmotionsStorage));
  });

  it('should skip migration when private field migration already completed', async () => {
    when(mockIonicStorage.get<boolean>(PRIVATE_FIELD_MIGRATION_KEY)).thenReturn(of(true));

    const service = createService();
    await firstValueFrom(service.runAllMigrations());

    verify(mockLikesStorage.getAll()).never();
    verify(mockDislikesStorage.getAll()).never();
    verify(mockEmotionsStorage.getAll()).never();
  });

  it('should run private field migration when not yet completed', async () => {
    when(mockIonicStorage.get<boolean>(PRIVATE_FIELD_MIGRATION_KEY)).thenReturn(of(false));
    when(mockLikesStorage.getAll()).thenReturn(of(<Action[]>MOCK_LIKES_WITHOUT_PRIVATE_FIELD));
    when(mockDislikesStorage.getAll()).thenReturn(of(<Action[]>MOCK_DISLIKES_WITHOUT_PRIVATE_FIELD));
    when(mockEmotionsStorage.getAll()).thenReturn(of(<Emotion[]>MOCK_EMOTIONS_WITHOUT_PRIVATE_FIELD));
    when(mockIonicStorage.set(anything(), anything())).thenReturn(of(undefined));

    const service = createService();
    await firstValueFrom(service.runAllMigrations());

    verify(mockLikesStorage.getAll()).once();
    verify(mockDislikesStorage.getAll()).once();
    verify(mockEmotionsStorage.getAll()).once();
  });

  it('should run private field migration when migration key is null', async () => {
    when(mockIonicStorage.get<boolean>(PRIVATE_FIELD_MIGRATION_KEY)).thenReturn(of(null));
    when(mockLikesStorage.getAll()).thenReturn(of(<Action[]>MOCK_LIKES_WITHOUT_PRIVATE_FIELD));
    when(mockDislikesStorage.getAll()).thenReturn(of(<Action[]>MOCK_DISLIKES_WITHOUT_PRIVATE_FIELD));
    when(mockEmotionsStorage.getAll()).thenReturn(of(<Emotion[]>MOCK_EMOTIONS_WITHOUT_PRIVATE_FIELD));
    when(mockIonicStorage.set(anything(), anything())).thenReturn(of(undefined));

    const service = createService();
    await firstValueFrom(service.runAllMigrations());

    verify(mockLikesStorage.getAll()).once();
    verify(mockDislikesStorage.getAll()).once();
    verify(mockEmotionsStorage.getAll()).once();
  });

  it('should set migration key to true after successful migration', async () => {
    when(mockIonicStorage.get<boolean>(PRIVATE_FIELD_MIGRATION_KEY)).thenReturn(of(false));
    when(mockLikesStorage.getAll()).thenReturn(of([]));
    when(mockDislikesStorage.getAll()).thenReturn(of([]));
    when(mockEmotionsStorage.getAll()).thenReturn(of([]));
    when(mockIonicStorage.set(anything(), anything())).thenReturn(of(undefined));

    const service = createService();
    await firstValueFrom(service.runAllMigrations());

    verify(mockIonicStorage.set(PRIVATE_FIELD_MIGRATION_KEY, true)).once();
  });

  it('should add private field to likes during migration', async () => {
    when(mockIonicStorage.get<boolean>(PRIVATE_FIELD_MIGRATION_KEY)).thenReturn(of(false));
    when(mockLikesStorage.getAll()).thenReturn(of(<Action[]>MOCK_LIKES_WITHOUT_PRIVATE_FIELD));
    when(mockDislikesStorage.getAll()).thenReturn(of(<Action[]>[]));
    when(mockEmotionsStorage.getAll()).thenReturn(of(<Emotion[]>[]));
    when(mockIonicStorage.set(anything(), anything())).thenReturn(of(undefined));

    const service = createService();
    await firstValueFrom(service.runAllMigrations());

    const [storageKey, savedLikes] = capture(mockIonicStorage.set<Action[]>).first();

    expect(storageKey).toBe(LIKES_STORAGE_KEY);
    expect(savedLikes).toHaveLength(2);
    expect(savedLikes[0]).toEqual({ ...MOCK_LIKES_WITHOUT_PRIVATE_FIELD[0], private: false });
    expect(savedLikes[1]).toEqual({ ...MOCK_LIKES_WITHOUT_PRIVATE_FIELD[1], private: false });
  });

  it('should add private field to dislikes during migration', async () => {
    when(mockIonicStorage.get<boolean>(PRIVATE_FIELD_MIGRATION_KEY)).thenReturn(of(false));
    when(mockLikesStorage.getAll()).thenReturn(of(<Action[]>[]));
    when(mockDislikesStorage.getAll()).thenReturn(of(<Action[]>MOCK_DISLIKES_WITHOUT_PRIVATE_FIELD));
    when(mockEmotionsStorage.getAll()).thenReturn(of(<Emotion[]>[]));
    when(mockIonicStorage.set(anything(), anything())).thenReturn(of(undefined));

    const service = createService();
    await firstValueFrom(service.runAllMigrations());

    const [storageKey, savedDislikes] = capture(mockIonicStorage.set<Action[]>).second();

    expect(storageKey).toBe(DISLIKES_STORAGE_KEY);
    expect(savedDislikes).toHaveLength(2);
    expect(savedDislikes[0]).toEqual({ ...MOCK_DISLIKES_WITHOUT_PRIVATE_FIELD[0], private: false });
    expect(savedDislikes[1]).toEqual({ ...MOCK_DISLIKES_WITHOUT_PRIVATE_FIELD[1], private: false });
  });

  it('should add private field to emotions during migration', async () => {
    when(mockIonicStorage.get<boolean>(PRIVATE_FIELD_MIGRATION_KEY)).thenReturn(of(false));
    when(mockLikesStorage.getAll()).thenReturn(of(<Action[]>[]));
    when(mockDislikesStorage.getAll()).thenReturn(of(<Action[]>[]));
    when(mockEmotionsStorage.getAll()).thenReturn(of(<Emotion[]>MOCK_EMOTIONS_WITHOUT_PRIVATE_FIELD));
    when(mockIonicStorage.set(anything(), anything())).thenReturn(of(undefined));

    const service = createService();
    await firstValueFrom(service.runAllMigrations());

    const [storageKey, savedEmotions] = capture(mockIonicStorage.set<Emotion[]>).third();

    expect(storageKey).toBe(EMOTIONS_STORAGE_KEY);
    expect(savedEmotions).toHaveLength(2);
    expect(savedEmotions[0]).toEqual({ ...MOCK_EMOTIONS_WITHOUT_PRIVATE_FIELD[0], private: false });
    expect(savedEmotions[1]).toEqual({ ...MOCK_EMOTIONS_WITHOUT_PRIVATE_FIELD[1], private: false });
  });

  it('should handle empty storage during migration', async () => {
    when(mockIonicStorage.get<boolean>(PRIVATE_FIELD_MIGRATION_KEY)).thenReturn(of(false));
    when(mockLikesStorage.getAll()).thenReturn(of(<Action[]>[]));
    when(mockDislikesStorage.getAll()).thenReturn(of(<Action[]>[]));
    when(mockEmotionsStorage.getAll()).thenReturn(of(<Emotion[]>[]));
    when(mockIonicStorage.set(anything(), anything())).thenReturn(of(undefined));

    const service = createService();
    await firstValueFrom(service.runAllMigrations());

    const [likesKey, savedLikes] = capture(mockIonicStorage.set<Action[]>).first();
    const [dislikesKey, savedDislikes] = capture(mockIonicStorage.set<Action[]>).second();
    const [emotionsKey, savedEmotions] = capture(mockIonicStorage.set<Emotion[]>).third();

    expect(likesKey).toBe(LIKES_STORAGE_KEY);
    expect(savedLikes).toEqual([]);
    expect(dislikesKey).toBe(DISLIKES_STORAGE_KEY);
    expect(savedDislikes).toEqual([]);
    expect(emotionsKey).toBe(EMOTIONS_STORAGE_KEY);
    expect(savedEmotions).toEqual([]);
  });
});
