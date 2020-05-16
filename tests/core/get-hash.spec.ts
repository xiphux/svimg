import getHash from '../../src/core/get-hash';
import { createHash } from 'crypto';

jest.mock('crypto');

describe('getHash', () => {

    let update: jest.Mock;
    let digest: jest.Mock;
    beforeEach(() => {
        digest = jest.fn();
        update = jest.fn();
        update.mockReturnValue({ digest });
        (createHash as jest.Mock).mockReset();
        (createHash as jest.Mock).mockReturnValue({ update });
    });

    it('returns an md5 hex hash', () => {
        digest.mockReturnValue('abcdefghi');

        expect(getHash('datatohash')).toEqual('abcdefghi');

        expect(createHash).toHaveBeenCalledWith('md5');
        expect(update).toHaveBeenCalledWith('datatohash');
        expect(digest).toHaveBeenCalledWith('hex');
    });

});