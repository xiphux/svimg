import resizeImage from '../../src/core/resize-image';
import sharp from 'sharp';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

jest.mock('sharp');

describe('resizeImage', () => {
  let jpeg: jest.Mock;
  let png: jest.Mock;
  let webp: jest.Mock;
  let avif: jest.Mock;
  let resize: jest.Mock;
  let toFile: jest.Mock;
  let toBuffer: jest.Mock;
  beforeEach(() => {
    (sharp as any as jest.Mock).mockReset();
    jpeg = jest.fn(() => ({
      jpeg,
      png,
      webp,
      avif,
      resize,
      toFile,
      toBuffer,
    }));
    png = jest.fn(() => ({
      jpeg,
      png,
      webp,
      avif,
      resize,
      toFile,
      toBuffer,
    }));
    webp = jest.fn(() => ({
      jpeg,
      png,
      webp,
      avif,
      resize,
      toFile,
      toBuffer,
    }));
    avif = jest.fn(() => ({
      jpeg,
      png,
      webp,
      avif,
      resize,
      toFile,
      toBuffer,
    }));
    resize = jest.fn(() => ({
      jpeg,
      png,
      webp,
      avif,
      resize,
      toFile,
      toBuffer,
    }));
    toFile = jest.fn();
    toBuffer = jest.fn();
    (sharp as any as jest.Mock).mockReturnValue({
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
