import ProcessingQueue from '../../src/core/processing-queue';

describe('ProcessingQueue', () => {

    interface TestInput {
        input: string;
    }

    interface TestOutput {
        output: string;
    }

    let runFunc = jest.fn();
    let hashFunc = jest.fn();

    class TestQueue extends ProcessingQueue<TestInput, TestOutput> {
        protected async getHashKey(input: TestInput): Promise<string> {
            return hashFunc(input);
        }
        protected async run(input: TestInput): Promise<TestOutput> {
            return runFunc(input.input);
        }
    }

    beforeEach(() => {
        runFunc.mockReset();
        hashFunc.mockReset();
    });

    it('will run a job', async () => {
        runFunc.mockImplementation(() => Promise.resolve({ output: 'test' }));
        hashFunc.mockImplementation(() => Promise.resolve('1'));

        const queue = new TestQueue();
        expect(await queue.process({
            input: 'inputstring'
        })).toEqual({ output: 'test' });

        expect(hashFunc).toHaveBeenCalledTimes(1);
        expect(hashFunc).toHaveBeenCalledWith({ input: 'inputstring' });
        expect(runFunc).toHaveBeenCalledTimes(1);
        expect(runFunc).toHaveBeenCalledWith('inputstring');
    });

    it('will cache for the same hash key', async () => {
        runFunc.mockImplementation(() => Promise.resolve({ output: 'test' }));
        hashFunc.mockImplementation(() => Promise.resolve('1'));

        const queue = new TestQueue();
        expect(await queue.process({
            input: 'inputstring'
        })).toEqual({ output: 'test' });
        expect(await queue.process({
            input: 'inputstring'
        })).toEqual({ output: 'test' });

        expect(hashFunc).toHaveBeenCalledTimes(2);
        expect(hashFunc).toHaveBeenCalledWith({ input: 'inputstring' });
        expect(runFunc).toHaveBeenCalledTimes(1);
        expect(runFunc).toHaveBeenCalledWith('inputstring');
    });

    it('will rerun if the hash key changes', async () => {
        runFunc.mockImplementationOnce(() => Promise.resolve({ output: 'test' })).mockImplementationOnce(() => Promise.resolve({ output: 'test2' }));
        hashFunc.mockImplementationOnce(() => Promise.resolve('1')).mockImplementationOnce(() => Promise.resolve('2'));

        const queue = new TestQueue();
        expect(await queue.process({
            input: 'inputstring'
        })).toEqual({ output: 'test' });
        expect(await queue.process({
            input: 'inputstring2'
        })).toEqual({ output: 'test2' });

        expect(hashFunc).toHaveBeenCalledTimes(2);
        expect(hashFunc).toHaveBeenCalledWith({ input: 'inputstring' });
        expect(hashFunc).toHaveBeenCalledWith({ input: 'inputstring2' });
        expect(runFunc).toHaveBeenCalledTimes(2);
        expect(runFunc).toHaveBeenCalledWith('inputstring');
        expect(runFunc).toHaveBeenCalledWith('inputstring2');
    });

});