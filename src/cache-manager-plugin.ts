import { CacheManagerRedisDataStore } from './cache-manager-redis-data-store'

export default {
    create(...args) {
        return new CacheManagerRedisDataStore(args)
    }
}
