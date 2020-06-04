const cacheManager = require('cache-manager');
const cacheManagerRedisDataStore = require('cache-manager-redis-data-store');

const redisCache = cacheManager.caching({ store: cacheManagerRedisDataStore, db: 0, ttl: 600 });
const memoryCache = cacheManager.caching({ store: 'memory', max: 100, ttl: 60 });

const multiCache = cacheManager.multiCaching([memoryCache, redisCache]);

const userId2 = 456;
const key2 = `user_${userId2}`;

// Set value in all caches
multiCache.set('foo2', 'bar2', { ttl: ttl }, (err) => {
    if (err) {
        throw err;
    }

    // Fetches from highest priority cache that has the key
    multiCache.get('foo2', (err, result) => {
        console.log(result);

        // Delete from all caches
        multiCache.del('foo2');
    });
});

// Note: ttl is optional in wrap
multiCache.wrap(key2, (cb) => {
    getUser(userId2, cb);
}, (err, user) => {
    console.log(user);

    // Second time fetches user from memoryCache, since it's highest priority.
    // If the data expires in the memory cache, the next fetch would pull it from
    // the 'someOtherCache', and set the data in memory again.
    multiCache.wrap(key2, (cb) => {
        getUser(userId2, cb);
    }, (err, user) => {
        console.log(user);
    });
});
