import getOptionsHash from '../../src/image-processing/get-options-hash';
import { createHash } from 'crypto';

jest.mock('crypto');

describe('getOptionsHash', () => {

    let update: jest.Mock;
    let digest: jest.Mock;
    beforeEach(() => {
        digest = jest.fn();
        update = jest.fn();
        update.mockReturnValue({ digest });
        (createHash as jest.Mock).mockReset();
        (createHash as jest.Mock).mockReturnValue({ update });
    });

    it('returns an md5 hash of options', () => {
        digest.mockReturnValue('abcdefghi');

        expect(getOptionsHash({ width: 500, quality: 80 })).toEqual('abcdefghi');

        expect(createHash).toHaveBeenCalledWith('md5');
        expect(update).toHaveBeenCalledWith('width=500,quality=80');
        expect(digest).toHaveBeenCalledWith('hex');
    });

    it('returns a truncated md5 hash of options', () => {
        digest.mockReturnValue('abcdefghi');

        expect(getOptionsHash({ width: 500, quality: 80 }, 7)).toEqual('abcdefg');

        expect(createHash).toHaveBeenCalledWith('md5');
        expect(update).toHaveBeenCalledWith('width=500,quality=80');
        expect(digest).toHaveBeenCalledWith('hex');
    });

});