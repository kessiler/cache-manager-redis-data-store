const cacheManager = require('cache-manager');
const cacheManagerRedisDataStore = require('cache-manager-redis-data-store');
const Redis = require('ioredis');

const redisInstance = new Redis({
    host: 'localhost',
    port: 6379,
    db: 0,
});

const redisCache = cacheManager.caching({
    store: cacheManagerRedisDataStore,
    redisInstance: redisInstance,
});
