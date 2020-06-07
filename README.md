# cache-manager-redis-data-store

<div align="center">

[![Build Status][github-actions-status]](github-actions-url)
[![Package version][npm-package-version]](npm-package-version-url)
[![Dependency Status][david-image]][david-url]
[![DevDependency Status][david-dev-image]][david-dev-url]

</div>

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

Go checkout the [examples](./examples) !

Contribution
------------

Want to help improving this package? Feel free to send a [pull requests](https://github.com/kessiler/cache-manager-redis/pulls).


License
-------

The `cache-manager-redis-data-store` is licensed under the [MIT license](https://github.com/kessiler/cache-manager-redis-data-store/LICENSE).


[github-actions-status]: https://github.com/kessiler/cache-manager-redis-data-store/workflows/Test/badge.svg
[github-actions-url]: https://github.com/kessiler/cache-manager-redis-data-store/actions
[npm-package-version-url]: https://www.npmjs.com/package/cache-manager-redis-data-store
[npm-package-version]: https://img.shields.io/npm/v/cache-manager-redis-data-store.svg
[david-image]: https://img.shields.io/david/cache-manager-redis-data-store/cache-manager-redis-data-store.svg
[david-url]: https://david-dm.org/cache-manager-redis-data-store/cache-manager-redis-data-store
[david-dev-image]: https://img.shields.io/david/dev/cache-manager-redis-data-store/cache-manager-redis-data-store.svg?label=devDependencies
[david-dev-url]: https://david-dm.org/cache-manager-redis-data-store/cache-manager-redis-data-store?type=dev
