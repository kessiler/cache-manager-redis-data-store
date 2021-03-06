import * as Redis from 'ioredis';
import {StoreConfig, TtlFunction } from 'cache-manager';

export class CacheManagerRedisDataStorePlugin {
    private readonly redisCache: any;
    private readonly isCacheableValue: Function;
    private readonly defaultTtlValue: number;

    constructor(storeOptions: StoreConfig) {
        if (storeOptions.redisInstance) {
            this.redisCache = storeOptions.redisInstance;
        } else if (storeOptions.clusterConfig) {
            const {
                nodes,
                options
            } = storeOptions.clusterConfig;

            this.redisCache = new Redis.Cluster(nodes, options || {});
        } else {
            this.redisCache = new Redis(...storeOptions as any);
        }
        this.isCacheableValue = storeOptions.isCacheableValue || (value => value !== undefined && value !== null);
        this.defaultTtlValue = storeOptions.ttl as number;
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
                this.redisCache.setex(key, ttl, val, CacheManagerRedisDataStorePlugin.handleResponse(cb));
            } else {
                this.redisCache.set(key, val, CacheManagerRedisDataStorePlugin.handleResponse(cb));
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

            this.redisCache.get(key, CacheManagerRedisDataStorePlugin.handleResponse(cb, {parse: true}));
        })
    }

    del(key, options, cb) {
        if (typeof options === 'function') {
            cb = options;
        }

        return this.redisCache.del(key, CacheManagerRedisDataStorePlugin.handleResponse(cb));
    }

    reset(cb) {
        return this.redisCache.flushdb(CacheManagerRedisDataStorePlugin.handleResponse(cb));
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

            this.redisCache.keys(pattern, CacheManagerRedisDataStorePlugin.handleResponse(cb));
        })
    }

    ttl(key, cb) {
        return this.redisCache.ttl(key, CacheManagerRedisDataStorePlugin.handleResponse(cb));
    }

    getClient() {
        return this.redisCache;
    }
}
