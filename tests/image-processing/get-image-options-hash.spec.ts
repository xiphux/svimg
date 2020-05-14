import getImageOptionsHash from '../../src/image-processing/get-image-options-hash';
import { createHash } from 'crypto';

jest.mock('crypto');

describe('getImageOptionsHash', () => {

    let update: jest.Mock;
    let digest: jest.Mock;
    beforeEach(() => {
        digest = jest.fn();
        update = jest.fn();
        update.mockReturnValue({ digest });
        (createHash as jest.Mock).mockReset();
        (createHash as jest.Mock).mockReturnValue({ update });
    });

    it('returns an abbreviated md5 hash of options', () => {
        digest.mockReturnValue('abcdefghi');

        expect(getImageOptionsHash({ width: 500, quality: 80 })).toEqual('abcdefg');

        expect(createHash).toHaveBeenCalledWith('md5');
        expect(update).toHaveBeenCalledWith('width=500,quality=80');
        expect(digest).toHaveBeenCalledWith('hex');
    });

});