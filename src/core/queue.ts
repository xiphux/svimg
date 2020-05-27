import PQueue from 'p-queue';

export interface QueueOptions {
    concurrency?: number;
}

export default class Queue {
    constructor(options?: QueueOptions) {
        this.cache = new Map();
        this.queue = new PQueue({ concurrency: options?.concurrency || Infinity });
    }

    private cache: Map<string, Promise<any>>;
    private queue: PQueue;

    public enqueue<TFunc extends ((...args: any[]) => Promise<any>)>(func: TFunc, ...args: Parameters<TFunc>): ReturnType<TFunc> {
        const cacheKey = `${func.name}|${JSON.stringify(args)}`;

        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey) as ReturnType<TFunc>;
        }

        const p = this.queue.add(() => func.apply(null, args));
        this.cache.set(cacheKey, p);
        return p as ReturnType<TFunc>;
    }
}