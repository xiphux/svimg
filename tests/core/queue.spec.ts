import Queue from '../../src/core/queue';
import PQueue from 'p-queue';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

vi.mock('p-queue');

describe('Queue', () => {
  let func1CallCount = 0;
  let func2CallCount = 0;

  function func1(val: string) {
    func1CallCount++;
    return Promise.resolve({
      func1: val,
    });
  }

  function func2(val: string) {
    func2CallCount++;
    return Promise.resolve({
      func2: val,
    });
  }

  beforeEach(() => {
    (PQueue as any as Mock).mockReturnValue({
      add: vi.mocked<(f: () => void) => void>((f) => f()),
    });
    func1CallCount = 0;
    func2CallCount = 0;
  });

  it('will initialize with default concurrency', async () => {
    const queue = new Queue();
    expect(PQueue).toHaveBeenCalledWith({ concurrency: Infinity });
  });

  it('will initialize with specified concurrency', async () => {
    const queue = new Queue({
      concurrency: 10000,
    });
    expect(PQueue).toHaveBeenCalledWith({ concurrency: 10000 });
  });

  it('will run a job', async () => {
    const queue = new Queue();

    expect(await queue.enqueue(func1, 'abc')).toEqual({ func1: 'abc' });

    expect(func1CallCount).toEqual(1);
  });

  it('will cache for the same function and params', async () => {
    const queue = new Queue();

    expect(await queue.enqueue(func1, 'abc')).toEqual({ func1: 'abc' });
    expect(await queue.enqueue(func1, 'abc')).toEqual({ func1: 'abc' });

    expect(func1CallCount).toEqual(1);
  });

  it('will rerun if the parameters change', async () => {
    const queue = new Queue();

    expect(await queue.enqueue(func1, 'abc')).toEqual({ func1: 'abc' });
    expect(await queue.enqueue(func1, 'def')).toEqual({ func1: 'def' });

    expect(func1CallCount).toEqual(2);
  });

  it('will rerun for a different function name', async () => {
    const queue = new Queue();

    expect(await queue.enqueue(func1, 'abc')).toEqual({ func1: 'abc' });
    expect(await queue.enqueue(func2, 'abc')).toEqual({ func2: 'abc' });

    expect(func1CallCount).toEqual(1);
    expect(func2CallCount).toEqual(1);
  });
});
