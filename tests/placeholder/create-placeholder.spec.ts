import createPlaceholder from '../../src/placeholder/create-placeholder';
import getImageMetadata from '../../src/core/get-image-metadata';
import resizeImage from '../../src/core/resize-image';
import getMimeType from '../../src/core/get-mime-type';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

vi.mock('../../src/core/get-image-metadata');
vi.mock('../../src/core/resize-image');
vi.mock('../../src/core/get-mime-type');

describe('createPlaceholder', () => {
  beforeEach(() => {
    (getImageMetadata as Mock).mockReset();
    (resizeImage as Mock).mockReset();
    (getMimeType as Mock).mockReset();
  });

  it('requires input file', async () => {
    await expect(
      createPlaceholder('', { enqueue: vi.fn() } as any),
    ).rejects.toThrow();
  });

  it('creates a placeholder', async () => {
    const enqueue = vi
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          width: 300,
          height: 200,
          format: 'jpeg',
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          toString: vi.fn(() => 'base64data'),
        }),
      );
    (getMimeType as Mock).mockReturnValue('image/jpeg');

    expect(await createPlaceholder('/in/file.jpg', { enqueue } as any)).toEqual(
      'data:image/jpeg;base64,base64data',
    );

    expect(enqueue).toHaveBeenCalledTimes(2);
    expect(enqueue).toHaveBeenCalledWith(getImageMetadata, '/in/file.jpg');
    expect(enqueue).toHaveBeenCalledWith(resizeImage, '/in/file.jpg', {
      width: 64,
    });
    expect(getMimeType).toHaveBeenCalledWith('jpeg');
  });
});
