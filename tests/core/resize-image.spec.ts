import resizeImage from '../../src/core/resize-image';
import sharp from 'sharp';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

vi.mock('sharp');

describe('resizeImage', () => {
  let jpeg: Mock;
  let png: Mock;
  let webp: Mock;
  let avif: Mock;
  let resize: Mock;
  let toFile: Mock;
  let toBuffer: Mock;
  beforeEach(() => {
    (sharp as any as Mock).mockReset();
    jpeg = vi.fn(() => ({
      jpeg,
      png,
      webp,
      avif,
      resize,
      toFile,
      toBuffer,
    }));
    png = vi.fn(() => ({
      jpeg,
      png,
      webp,
      avif,
      resize,
      toFile,
      toBuffer,
    }));
    webp = vi.fn(() => ({
      jpeg,
      png,
      webp,
      avif,
      resize,
      toFile,
      toBuffer,
    }));
    avif = vi.fn(() => ({
      jpeg,
      png,
      webp,
      avif,
      resize,
      toFile,
      toBuffer,
    }));
    resize = vi.fn(() => ({
      jpeg,
      png,
      webp,
      avif,
      resize,
      toFile,
      toBuffer,
    }));
    toFile = vi.fn();
    toBuffer = vi.fn();
    (sharp as any as Mock).mockReturnValue({
      jpeg,
      png,
      webp,
      avif,
      resize,
      toFile,
      toBuffer,
    });
  });

  it('requires an input file', async () => {
    await expect(resizeImage('', { width: 300 })).rejects.toThrow();
  });

  it('resizes to buffer', async () => {
    toBuffer.mockImplementation(() => Promise.resolve({ data: true }));

    expect(await resizeImage('/in/file.jpg', { width: 300 })).toEqual({
      data: true,
    });

    expect(sharp).toHaveBeenCalledWith('/in/file.jpg');
    expect(resize).toHaveBeenCalledWith(300, undefined);
    expect(toBuffer).toHaveBeenCalled();
    expect(toFile).not.toHaveBeenCalled();
  });

  it('resizes to file', async () => {
    toFile.mockImplementation(() => Promise.resolve({ data: true }));

    expect(
      await resizeImage('/in/file.jpg', { width: 300 }, '/out/file.jpg'),
    ).toEqual({ data: true });

    expect(sharp).toHaveBeenCalledWith('/in/file.jpg');
    expect(resize).toHaveBeenCalledWith(300, undefined);
    expect(toFile).toHaveBeenCalledWith('/out/file.jpg');
    expect(toBuffer).not.toHaveBeenCalled();
  });

  it('resizes to buffer with quality and height', async () => {
    toBuffer.mockImplementation(() => Promise.resolve({ data: true }));

    expect(
      await resizeImage('/in/file.jpg', {
        width: 300,
        height: 200,
        quality: 75,
      }),
    ).toEqual({ data: true });

    expect(sharp).toHaveBeenCalledWith('/in/file.jpg');
    expect(jpeg).toHaveBeenCalledWith({
      quality: 75,
      force: false,
    });
    expect(png).toHaveBeenCalledWith({
      quality: 75,
      force: false,
    });
    expect(webp).toHaveBeenCalledWith({
      quality: 75,
      force: false,
    });
    expect(avif).toHaveBeenCalledWith({
      quality: 75,
      force: false,
    });
    expect(resize).toHaveBeenCalledWith(300, 200);
    expect(toBuffer).toHaveBeenCalled();
    expect(toFile).not.toHaveBeenCalled();
  });

  it('resizes to file with quality and height', async () => {
    toFile.mockImplementation(() => Promise.resolve({ data: true }));

    expect(
      await resizeImage(
        '/in/file.jpg',
        {
          width: 300,
          height: 200,
          quality: 75,
        },
        '/out/file.jpg',
      ),
    ).toEqual({ data: true });

    expect(sharp).toHaveBeenCalledWith('/in/file.jpg');
    expect(jpeg).toHaveBeenCalledWith({
      quality: 75,
      force: false,
    });
    expect(png).toHaveBeenCalledWith({
      quality: 75,
      force: false,
    });
    expect(webp).toHaveBeenCalledWith({
      quality: 75,
      force: false,
    });
    expect(avif).toHaveBeenCalledWith({
      quality: 75,
      force: false,
    });
    expect(resize).toHaveBeenCalledWith(300, 200);
    expect(toFile).toHaveBeenCalledWith('/out/file.jpg');
    expect(toBuffer).not.toHaveBeenCalled();
  });
});
