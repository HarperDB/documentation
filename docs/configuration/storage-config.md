# `storage`

`writeAsync` - _Type_: boolean; _Default_: false

The `writeAsync` option turns off disk flushing/syncing, allowing for faster write operation throughput. However, this does not provide storage integrity guarantees, and if a server crashes, it is possible that there may be data loss requiring restore from another backup/another node.

```yaml
storage:
  writeAsync: false
```

`caching` - _Type_: boolean; _Default_: true

The `caching` option enables in-memory caching of records, providing faster access to frequently accessed objects. This can incur some extra overhead for situations where reads are extremely random and don't benefit from caching.

```yaml
storage:
  caching: true
```


`compression` - _Type_: boolean; _Default_: false

The `compression` option enables compression of records in the database. This can be helpful for very large databases in reducing storage requirements and potentially allowing more data to be cached. This uses the very fast LZ4 compression algorithm, but this still incurs extra costs for compressing and decompressing.

```yaml
storage:
  compression: false
```


`noReadAhead` - _Type_: boolean; _Default_: true

The `noReadAhead` option advises the operating system to not read ahead when reading from the database. This provides better memory utilization, except in situations where large records are used or frequent range queries are used.

```yaml
storage:
  noReadAhead: true
```


`prefetchWrites` - _Type_: boolean; _Default_: true

The `prefetchWrites` option loads data prior to write transactions. This should be enabled for databases that are larger than memory (although it can be faster to disable this for smaller databases).

```yaml
storage:
  prefetchWrites: true
```


`path` - _Type_: string; _Default_: `<rootPath>/schema`

The `path` configuration sets where all database files should reside.

```yaml
storage:
  path: /users/harperdb/storage
```

**_Note:_** This configuration applies to all database files, which includes system tables that are used internally by HarperDB. For this reason if you wish to use a non default `path` value you must move any existing schemas into your `path` location. Existing schemas is likely to include the system schema which can be found at `<rootPath>/schema/system`.
