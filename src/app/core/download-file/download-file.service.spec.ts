import { Capacitor } from '@capacitor/core';
import { saveAs } from 'file-saver';
import { cold } from 'jest-marbles';
import { MockRender } from 'ng-mocks';
import { DownloadService } from './download-file.service';

jest.mock('file-saver');

describe('DownloadService', () => {
  function createService(): DownloadService {
    const fixture = MockRender(DownloadService);
    return fixture.point.componentInstance;
  }

  describe('PWA', () => {
    beforeEach(() => {
      jest.spyOn(Capacitor, 'getPlatform').mockReturnValue('web');
      jest.mocked(saveAs).mockImplementation(() => {});
    });

    it('should call "saveAs" method from "file-saver" with parameters', () => {
      const mockData = '{"test": "data"}';
      const mockFilename = 'test.json';

      const service = createService();
      expect(service.download(mockData, mockFilename)).toBeObservable(cold('(a|)', { a: void 0 }));
      expect(Capacitor.getPlatform).toHaveBeenCalled();
      expect(saveAs).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockFilename,
          type: 'application/json;charset=utf-8',
          size: mockData.length,
        }),
      );
    });
  });
});
