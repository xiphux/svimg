import Queue from '../../src/core/queue';
import PQueue from 'p-queue';
import os from 'os';

jest.mock('p-queue', () => ({
    default: jest.fn()
}));
jest.mock('os', () => ({
    cpus: jest.fn(() => [{ num: 1 }, { num: 2 }, { num: 3 }, { num: 4 }]),
}));

describe('Queue', () => {

    let add: jest.Mock;
    beforeEach(() => {
        add = jest.fn((f) => f());
        (PQueue as any as jest.Mock).mockReturnValue({
            add,
        });
    });

    it('will initialize based on cpus', async () => {
        const queue = new Queue();
        expect(PQueue).toHaveBeenCalledWith({ concurrency: 4 });
    });

    it('will run a job', async () => {
        const queue = new Queue();

        const func = jest.fn(() => Promise.resolve({ val: true }));
        expect(await queue.enqueue(func, 'abc')).toEqual({ val: true });

        expect(func).toHaveBeenCalledTimes(1);
        expect(add).toHaveBeenCalledWith(func);
    });

    it('will cache for the same hash key', async () => {
        const queue = new Queue();

        const func = jest.fn(() => Promise.resolve({ val: true }));
        const func2 = jest.fn(() => Promise.resolve({ val: true }));

        expect(await queue.enqueue(func, 'abc')).toEqual({ val: true });
        expect(await queue.enqueue(func2, 'abc')).toEqual({ val: true });

        expect(func).toHaveBeenCalledTimes(1);
        expect(add).toHaveBeenCalledWith(func);
        expect(func2).not.toHaveBeenCalled();
        expect(add).not.toHaveBeenCalledWith(func2);
    });

    it('will rerun if the hash key changes', async () => {
        const queue = new Queue();

        const func = jest.fn(() => Promise.resolve({ val: true }));
        expect(await queue.enqueue(func, 'abc')).toEqual({ val: true });
        expect(await queue.enqueue(func, 'def')).toEqual({ val: true });

        expect(func).toHaveBeenCalledTimes(2);
        expect(add).toHaveBeenCalledTimes(2);
        expect(add).toHaveBeenNthCalledWith(1, func);
        expect(add).toHaveBeenNthCalledWith(2, func);
    });

});
