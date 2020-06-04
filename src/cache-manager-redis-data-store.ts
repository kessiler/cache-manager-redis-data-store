import * as Redis from 'ioredis';

export class CacheManagerRedisDataStore {
    private readonly redisCache: any;
    private readonly isCacheableValue: Function;
    private readonly defaultTtlValue: number;

    constructor(...args) {
        if (args.length > 0 && args[0].redisInstance) {
            this.redisCache = args[0].redisInstance;
        } else if (args.length > 0 && args[0].clusterConfig) {
            const {
                nodes,
                options
            } = args[0].clusterConfig;

            this.redisCache = new Redis.Cluster(nodes, options || {});
        } else {
            this.redisCache = new Redis(...args);
        }
        this.isCacheableValue = this.redisCache.options.isCacheableValue || (value => value !== undefined && value !== null);
        this.defaultTtlValue = this.redisCache.options.ttl || 0;
    }

    static handleResponse(callbackfn: (err: Error, result?: {}) => void, opts = {parse: false}) {
        return (err: Error, result) => {
            if (err) {
                return callbackfn && callbackfn(err);
            }

            if (opts.parse) {
                try {
                    result = JSON.parse(result);
                } catch (e) {
                    return callbackfn && callbackfn(e);
                }
            }

            return callbackfn && callbackfn(null, result);
        };
    }

    set(key: string, value: any, options: any, cb: (err, result?: {}) => void): Promise<any> {
        return new Promise((resolve, reject) => {
            if (typeof options === 'function') {
                cb = options;
                options = {};
            }
            options = options || {};

            if (!cb) {
                cb = (err, result) => (err ? reject(err) : resolve(result));
            }

            if (!this.isCacheableValue(value)) {
                return cb(new Error(`"${value}" is not a cacheable value`));
            }

            const ttl = (options.ttl || options.ttl === 0) ? options.ttl : this.defaultTtlValue;
            const val = JSON.stringify(value) || '"undefined"';

            if (ttl) {
                this.redisCache.setex(key, ttl, val, CacheManagerRedisDataStore.handleResponse(cb));
            } else {
                this.redisCache.set(key, val, CacheManagerRedisDataStore.handleResponse(cb));
            }
        })
    }

    get(key, options, cb) {
        return new Promise((resolve, reject) => {
            if (typeof options === 'function') {
                cb = options;
            }

            if (!cb) {
                cb = (err, result) => (err ? reject(err) : resolve(result));
            }

            this.redisCache.get(key, CacheManagerRedisDataStore.handleResponse(cb, {parse: true}));
        })
    }

    del(key, options, cb) {
        if (typeof options === 'function') {
            cb = options;
        }

        return this.redisCache.del(key, CacheManagerRedisDataStore.handleResponse(cb));
    }

    reset(cb) {
        return this.redisCache.flushdb(CacheManagerRedisDataStore.handleResponse(cb));
    }

    keys(pattern, cb) {
        return new Promise((resolve, reject) => {
            if (typeof pattern === 'function') {
                cb = pattern;
                pattern = '*';
            }

            if (!cb) {
                cb = (err, result) => (err ? reject(err) : resolve(result));
            }

            this.redisCache.keys(pattern, CacheManagerRedisDataStore.handleResponse(cb));
        })
    }

    ttl(key, cb) {
        return this.redisCache.ttl(key, CacheManagerRedisDataStore.handleResponse(cb));
    }

    getClient() {
        return this.redisCache;
    }
}
