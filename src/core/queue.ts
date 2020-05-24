import PQueue from 'p-queue';
import os from 'os';

export default class Queue {
    constructor() {
        this.cache = new Map();
        this.queue = new PQueue({ concurrency: os.cpus().length });
    }

    private cache: Map<string, Promise<any>>;
    private queue: PQueue;

    public async enqueue<TReturn>(func: () => Promise<TReturn>, cacheKey: string): Promise<TReturn> {
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const p = this.queue.add(func);
        this.cache.set(cacheKey, p);
        return p;
    }
}