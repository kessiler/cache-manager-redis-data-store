# cache-manager-redis-data-store
This is a redis data store for node cache manager.

This package uses ioredis by default, however, you can change it.

It supports passing your external redis instance, allowing you to use (node_redis, ioredis) or just passing the configuration to the underlying redis package used.

Installation
------------

```sh
npm install cache-manager-redis-data-store --save
```
or
```sh
yarn add cache-manager-redis-data-store
```


Examples
--------

Go checkout [examples](./examples) !

Contribution
------------

Want to help improving this package? Feel free to send a [pull requests](https://github.com/kessiler/cache-manager-redis/pulls).


License
-------

The `cache-manager-redis-data-store` is licensed under the MIT license.
