import { CacheManagerRedisDataStorePlugin } from './cache-manager-redis-data-store-plugin'
import { StoreConfig } from 'cache-manager';

export default {
    create(options: StoreConfig) {
        return new CacheManagerRedisDataStorePlugin(options)
    }
}
