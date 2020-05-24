import exists from '../../src/core/exists';
import fs from 'fs';

jest.mock('fs', () => ({
    default: {
        promises: {
            access: jest.fn(),
        },
        constants: {
            F_OK: 1,
        }
    }
}));

describe('exists', () => {

    beforeEach(() => {
        (fs.promises.access as jest.Mock).mockReset();
    });

    it('returns false without file', async () => {
        expect(await exists('')).toEqual(false);
        expect(fs.promises.access).not.toHaveBeenCalled();
    });

    it('returns true if file exists', async () => {
        (fs.promises.access as jest.Mock).mockImplementation(() => Promise.resolve());
        expect(await exists('test/file.jpg')).toEqual(true);
        expect(fs.promises.access).toHaveBeenCalledWith('test/file.jpg', fs.constants.F_OK);
    });

    it('returns false if file doesn\'t exist', async () => {
        (fs.promises.access as jest.Mock).mockImplementation(() => Promise.reject({
            code: 'ENOENT'
        }));
        expect(await exists('test/file.jpg')).toEqual(false);
        expect(fs.promises.access).toHaveBeenCalledWith('test/file.jpg', fs.constants.F_OK);
    });

    it('throws error if encountered', async () => {
        (fs.promises.access as jest.Mock).mockImplementation(() => Promise.reject({
            code: 'EPERM'
        }));
        await expect(exists('test/file.jpg')).rejects.toThrow();
        expect(fs.promises.access).toHaveBeenCalledWith('test/file.jpg', fs.constants.F_OK);
    });

});
