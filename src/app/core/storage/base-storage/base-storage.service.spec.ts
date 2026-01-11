import { Injectable } from '@angular/core';
import { MockBuilder, MockRender } from 'ng-mocks';
import { firstValueFrom, of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';
import { BaseEntity } from '../../model/base-entity.interface';
import { IonicStorageService } from '../ionic-storage/ionic-storage.service';
import { BaseStorageService } from './base-storage.service';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}));

interface TestEntity extends BaseEntity {
  name: string;
  value: number;
}

@Injectable()
class TestStorageService extends BaseStorageService<TestEntity> {
  constructor() {
    super();
  }

  public configureStorage(storageKey: string, placeToInsertNewEntity: 'begin' | 'end'): void {
    this.setStorageKey(storageKey);
    this.setPlaceToInsertNewEntity(placeToInsertNewEntity);
  }
}

describe('BaseStorageService', () => {
  function createService(storageKey: string, placeToInsertNewEntity: 'begin' | 'end'): TestStorageService {
    const service = MockRender(TestStorageService).point.componentInstance;
    service.configureStorage(storageKey, placeToInsertNewEntity);
    return service;
  }

  let mockIonicStorage: IonicStorageService;
  const testStorageKey = 'test-storage-key';

  beforeEach(() => {
    mockIonicStorage = mock(IonicStorageService);
    return MockBuilder(TestStorageService).mock(IonicStorageService, instance(mockIonicStorage));
  });

  describe('getAll', () => {
    it('should return all entities from storage', async () => {
      const expectedEntities: TestEntity[] = [
        { id: '1', name: 'entity1', value: 10, private: false },
        { id: '2', name: 'entity2', value: 20, private: false },
      ];
      when(mockIonicStorage.get<TestEntity[]>(testStorageKey)).thenReturn(of(expectedEntities));

      const service = createService(testStorageKey, 'end');

      expect(await firstValueFrom(service.getAll())).toEqual(expectedEntities);
      verify(mockIonicStorage.get(testStorageKey)).once();
    });

    it('should return null when storage is empty', async () => {
      when(mockIonicStorage.get<TestEntity[]>(testStorageKey)).thenReturn(of([]));

      const service = createService(testStorageKey, 'end');

      expect(await firstValueFrom(service.getAll())).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return entity by id', async () => {
      const entities: TestEntity[] = [
        { id: '1', name: 'entity1', value: 10, private: false },
        { id: '2', name: 'entity2', value: 20, private: false },
      ];
      when(mockIonicStorage.get<TestEntity[]>(testStorageKey)).thenReturn(of(entities));

      const service = createService(testStorageKey, 'end');

      expect(await firstValueFrom(service.getById('2'))).toEqual({
        id: '2',
        name: 'entity2',
        value: 20,
        private: false,
      });
    });

    it('should return null when entity not found', async () => {
      const entities: TestEntity[] = [
        { id: '1', name: 'entity1', value: 10, private: false },
        { id: '2', name: 'entity2', value: 20, private: false },
      ];
      when(mockIonicStorage.get<TestEntity[]>(testStorageKey)).thenReturn(of(entities));

      const service = createService(testStorageKey, 'end');

      expect(await firstValueFrom(service.getById('non-existent'))).toBeNull();
    });

    it('should return null when storage is empty', async () => {
      when(mockIonicStorage.get<TestEntity[]>(testStorageKey)).thenReturn(of([]));

      const service = createService(testStorageKey, 'end');

      expect(await firstValueFrom(service.getById('1'))).toBeNull();
    });
  });

  describe('create', () => {
    it('should add new entity to the end when placeToInsertNewEntity is "end"', async () => {
      const existingEntities: TestEntity[] = [{ id: '1', name: 'entity1', value: 10, private: false }];
      const newEntity: Omit<TestEntity, 'id'> = { name: 'entity2', value: 20, private: true };

      when(mockIonicStorage.get<TestEntity[]>(testStorageKey)).thenReturn(of(existingEntities));
      when(mockIonicStorage.set<TestEntity>(testStorageKey, anything())).thenReturn(of(undefined));

      const service = createService(testStorageKey, 'end');
      await firstValueFrom(service.create(newEntity));

      verify(mockIonicStorage.set<TestEntity>(testStorageKey, anything())).once();
      const [storageKey, savedEntities] = capture(mockIonicStorage.set<TestEntity[]>).last();

      expect(storageKey).toBe(testStorageKey);
      expect(savedEntities).toHaveLength(2);
      expect(savedEntities[0]).toEqual({ id: '1', name: 'entity1', value: 10, private: false });
      expect(savedEntities[1]).toMatchObject({ name: 'entity2', value: 20, private: true });
      expect(savedEntities[1].id).toBeDefined();
    });

    it('should add new entity to the begin when placeToInsertNewEntity is "begin"', async () => {
      const existingEntities: TestEntity[] = [{ id: '1', name: 'entity1', value: 10, private: false }];
      const newEntity: Omit<TestEntity, 'id'> = { name: 'entity2', value: 20, private: true };

      when(mockIonicStorage.get<TestEntity[]>(testStorageKey)).thenReturn(of(existingEntities));
      when(mockIonicStorage.set<TestEntity>(testStorageKey, anything())).thenReturn(of(undefined));

      const service = createService(testStorageKey, 'begin');
      await firstValueFrom(service.create(newEntity));

      verify(mockIonicStorage.set<TestEntity>(testStorageKey, anything())).once();
      const [storageKey, savedEntities] = capture(mockIonicStorage.set<TestEntity[]>).last();

      expect(storageKey).toBe(testStorageKey);
      expect(savedEntities).toHaveLength(2);
      expect(savedEntities[0]).toMatchObject({ name: 'entity2', value: 20, private: true });
      expect(savedEntities[0].id).toBeDefined();
      expect(savedEntities[1]).toEqual({ id: '1', name: 'entity1', value: 10, private: false });
    });

    it('should create entity when storage is empty and placeToInsertNewEntity is "end"', async () => {
      const newEntity: Omit<TestEntity, 'id'> = { name: 'entity1', value: 10, private: false };

      when(mockIonicStorage.get<TestEntity[]>(testStorageKey)).thenReturn(of([]));
      when(mockIonicStorage.set<TestEntity>(testStorageKey, anything())).thenReturn(of(undefined));

      const service = createService(testStorageKey, 'end');
      await firstValueFrom(service.create(newEntity));

      verify(mockIonicStorage.set<TestEntity>(testStorageKey, anything())).once();
      const [storageKey, savedEntities] = capture(mockIonicStorage.set<TestEntity[]>).last();

      expect(storageKey).toBe(testStorageKey);
      expect(savedEntities).toHaveLength(1);
      expect(savedEntities[0]).toMatchObject({ name: 'entity1', value: 10, private: false });
      expect(savedEntities[0].id).toBeDefined();
    });

    it('should create entity when storage is empty and placeToInsertNewEntity is "begin"', async () => {
      const newEntity: Omit<TestEntity, 'id'> = { name: 'entity1', value: 10, private: false };

      when(mockIonicStorage.get<TestEntity[]>(testStorageKey)).thenReturn(of([]));
      when(mockIonicStorage.set<TestEntity>(testStorageKey, anything())).thenReturn(of(undefined));

      const service = createService(testStorageKey, 'begin');
      await firstValueFrom(service.create(newEntity));

      verify(mockIonicStorage.set<TestEntity>(testStorageKey, anything())).once();
      const [storageKey, savedEntities] = capture(mockIonicStorage.set<TestEntity[]>).last();

      expect(storageKey).toBe(testStorageKey);
      expect(savedEntities).toHaveLength(1);
      expect(savedEntities[0]).toMatchObject({ name: 'entity1', value: 10, private: false });
      expect(savedEntities[0].id).toBeDefined();
    });
  });

  describe('updateById', () => {
    it('should update entity by id', async () => {
      const entities: TestEntity[] = [
        { id: '1', name: 'entity1', value: 10, private: false },
        { id: '2', name: 'entity2', value: 20, private: false },
      ];
      const updatedData: Omit<TestEntity, 'id'> = { name: 'updated', value: 30, private: true };

      when(mockIonicStorage.get<TestEntity[]>(testStorageKey)).thenReturn(of(entities));
      when(mockIonicStorage.set<TestEntity>(testStorageKey, anything())).thenReturn(of(undefined));

      const service = createService(testStorageKey, 'end');
      await firstValueFrom(service.updateById('2', updatedData));

      verify(mockIonicStorage.set<TestEntity>(testStorageKey, anything())).once();
      const [storageKey, savedEntities] = capture(mockIonicStorage.set<TestEntity[]>).last();

      expect(storageKey).toBe(testStorageKey);
      expect(savedEntities).toHaveLength(2);
      expect(savedEntities[0]).toEqual({ id: '1', name: 'entity1', value: 10, private: false });
      expect(savedEntities[1]).toEqual({ id: '2', name: 'updated', value: 30, private: true });
    });

    it('should not modify other entities when updating', async () => {
      const entities: TestEntity[] = [
        { id: '1', name: 'entity1', value: 10, private: false },
        { id: '2', name: 'entity2', value: 20, private: false },
        { id: '3', name: 'entity3', value: 30, private: false },
      ];
      const updatedData: Omit<TestEntity, 'id'> = { name: 'updated', value: 25, private: false };

      when(mockIonicStorage.get<TestEntity[]>(testStorageKey)).thenReturn(of(entities));
      when(mockIonicStorage.set<TestEntity>(testStorageKey, anything())).thenReturn(of(undefined));

      const service = createService(testStorageKey, 'end');
      await firstValueFrom(service.updateById('2', updatedData));

      const [storageKey, savedEntities] = capture(mockIonicStorage.set<TestEntity[]>).last();

      expect(storageKey).toBe(testStorageKey);
      expect(savedEntities[0]).toEqual({ id: '1', name: 'entity1', value: 10, private: false });
      expect(savedEntities[2]).toEqual({ id: '3', name: 'entity3', value: 30, private: false });
    });

    it('should handle update when storage is empty', async () => {
      const updatedData: Omit<TestEntity, 'id'> = { name: 'updated', value: 30, private: false };

      when(mockIonicStorage.get<TestEntity[]>(testStorageKey)).thenReturn(of([]));
      when(mockIonicStorage.set<TestEntity>(testStorageKey, anything())).thenReturn(of(undefined));

      const service = createService(testStorageKey, 'end');
      await firstValueFrom(service.updateById('1', updatedData));

      const [storageKey, savedEntities] = capture(mockIonicStorage.set<TestEntity[]>).last();
      expect(storageKey).toBe(testStorageKey);
      expect(savedEntities).toHaveLength(0);
    });
  });

  describe('removeById', () => {
    it('should remove entity by id', async () => {
      const entities: TestEntity[] = [
        { id: '1', name: 'entity1', value: 10, private: false },
        { id: '2', name: 'entity2', value: 20, private: false },
        { id: '3', name: 'entity3', value: 30, private: false },
      ];

      when(mockIonicStorage.get<TestEntity[]>(testStorageKey)).thenReturn(of(entities));
      when(mockIonicStorage.set<TestEntity>(testStorageKey, anything())).thenReturn(of(undefined));

      const service = createService(testStorageKey, 'end');
      await firstValueFrom(service.removeById('2'));

      verify(mockIonicStorage.set<TestEntity>(testStorageKey, anything())).once();
      const [storageKey, savedEntities] = capture(mockIonicStorage.set<TestEntity[]>).last();

      expect(storageKey).toBe(testStorageKey);
      expect(savedEntities).toHaveLength(2);
      expect(savedEntities[0]).toEqual({ id: '1', name: 'entity1', value: 10, private: false });
      expect(savedEntities[1]).toEqual({ id: '3', name: 'entity3', value: 30, private: false });
    });

    it('should handle removal when entity does not exist', async () => {
      const entities: TestEntity[] = [{ id: '1', name: 'entity1', value: 10, private: false }];

      when(mockIonicStorage.get<TestEntity[]>(testStorageKey)).thenReturn(of(entities));
      when(mockIonicStorage.set<TestEntity>(testStorageKey, anything())).thenReturn(of(undefined));

      const service = createService(testStorageKey, 'end');
      await firstValueFrom(service.removeById('non-existent'));

      const [storageKey, savedEntities] = capture(mockIonicStorage.set<TestEntity[]>).last();

      expect(storageKey).toBe(testStorageKey);
      expect(savedEntities).toHaveLength(1);
      expect(savedEntities[0]).toEqual({ id: '1', name: 'entity1', value: 10, private: false });
    });

    it('should handle removal when storage is empty', async () => {
      when(mockIonicStorage.get<TestEntity[]>(testStorageKey)).thenReturn(of([]));
      when(mockIonicStorage.set<TestEntity>(testStorageKey, anything())).thenReturn(of(undefined));

      const service = createService(testStorageKey, 'end');
      await firstValueFrom(service.removeById('1'));

      const [storageKey, savedEntities] = capture(mockIonicStorage.set<TestEntity[]>).last();

      expect(storageKey).toBe(testStorageKey);
      expect(savedEntities).toHaveLength(0);
    });
  });
});
