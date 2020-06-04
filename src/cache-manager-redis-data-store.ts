import { CacheManagerRedisDataStorePlugin } from './cache-manager-redis-data-store-plugin'

export default {
    create(...args) {
        return new CacheManagerRedisDataStorePlugin(args)
    }
}
