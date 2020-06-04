const cacheManager = require('cache-manager');
const cacheManagerRedisDataStore = require('cache-manager-redis-data-store');

const redisCache = cacheManager.caching({
    store: cacheManagerRedisStore,
    host: 'localhost', // default value
    port: 6379, // default value
    password: 'XXXXX',
    db: 0,
    ttl: 600
});

// listen for redis connection error event
const redisClient = redisCache.store.getClient();

redisClient.on('error', (error) => {
    // handle error here
    console.log(error);
});

const ttl = 5;

redisCache.set('foo', 'bar', { ttl: ttl }, (err) => {
    if (err) {
        throw err;
    }

    redisCache.get('foo', (err, result) => {
        console.log(result);
        // >> 'bar'
        redisCache.del('foo', (err) => {
        });
    });
});

function getUser(id, cb = (err, result) => {}) {
    setTimeout(() => {
        console.log("Returning user from slow database.");
        cb(null, { id: id, name: 'Bob' });
    }, 100);
}

const userId = 123;
const key = `user_${userId}`;

// Note: ttl is optional in wrap()
redisCache.wrap(key, (cb) => {
    getUser(userId, cb);
}, { ttl: ttl }, (err, user) => {
    console.log(user);

    // Second time fetches user from redisCache
    redisCache
        .wrap(key, () => getUser(userId))
        .then(console.log)
        .catch(err => {
            // handle error
        });
});
