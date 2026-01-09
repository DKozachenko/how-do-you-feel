import { Storage } from '@ionic/storage-angular';
import { MockBuilder, MockRender } from 'ng-mocks';
import { firstValueFrom } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';
import { IonicStorageService } from './ionic-storage.service';

describe('IonicStorageService', () => {
  function createService(): IonicStorageService {
    return MockRender(IonicStorageService).point.componentInstance;
  }

  let mockStorage: Storage;

  beforeEach(() => {
    mockStorage = mock(Storage);
    return MockBuilder(IonicStorageService).mock(Storage, instance(mockStorage));
  });

  it('should create storage and return Observable<Storage>', async () => {
    const expectedStorage = instance(mockStorage);
    when(mockStorage.create()).thenResolve(expectedStorage);

    const service = createService();

    expect(await firstValueFrom(service.init())).toBe(expectedStorage);
    verify(mockStorage.create()).once();
  });

  it('should set value in storage', async () => {
    const key = 'test-key';
    const value = { data: 'test-value' };
    when(mockStorage.set(key, value)).thenResolve(undefined);

    const service = createService();
    await firstValueFrom(service.set(key, value));

    verify(mockStorage.set(key, value)).once();
  });

  it('should get value from storage', async () => {
    const key = 'test-key';
    const expectedValue = { data: 'test-value' };
    when(mockStorage.get(key)).thenResolve(expectedValue);

    const service = createService();

    expect(await firstValueFrom(service.get(key))).toEqual(expectedValue);
    verify(mockStorage.get(key)).once();
  });

  it('should return null when key does not exist', async () => {
    const key = 'non-existent-key';
    when(mockStorage.get(key)).thenResolve(null);

    const service = createService();

    expect(await firstValueFrom(service.get(key))).toBeNull();
  });

  it('should return null on error', async () => {
    const key = 'error-key';
    const error = new Error('Storage error');
    when(mockStorage.get(key)).thenReject(error);

    const service = createService();

    expect(await firstValueFrom(service.get(key))).toBeNull();
    verify(mockStorage.get(key)).once();
  });

  it('should remove value from storage', async () => {
    const key = 'test-key';
    when(mockStorage.remove(key)).thenResolve(undefined);

    const service = createService();
    await firstValueFrom(service.remove(key));

    verify(mockStorage.remove(key)).once();
  });
});
