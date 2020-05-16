export default abstract class ProcessingQueue<TInput, TOutput> {
    constructor() {
        this.cache = new Map();
    }

    private cache: Map<string, Promise<TOutput>>;

    public async process(input: TInput): Promise<TOutput> {
        const cacheKey = await this.getHashKey(input);

        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const p = this.run(input);
        this.cache.set(cacheKey, p);
        return p;
    }

    protected abstract async getHashKey(input: TInput): Promise<string>;

    protected abstract async run(input: TInput): Promise<TOutput>;
}