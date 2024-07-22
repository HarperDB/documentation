NOTE: This is not fully implemented yet
HarperDB's replication system supports various levels of replication or sharding. HarperDB can be configured or set up to replicate to different data to different subsets of nodes. This can be used facilitate horizontally scalability of storage and write performance, while maintaining optimal strategies of data locality and data consistency. 

## Configuration
By default, HarperDB will replicate all data to all nodes. However, the simplest way to configure sharding and limit replication to improve performance and efficiency is to configure a replication count. This will limit the number of nodes that data is replicated to. For example, to limit replication to 2 nodes, you can set the replication count to 2 in the `replication` section of the `harperdb-config.yaml` file:
```yaml
replication:
  replicationCount: 2
```

## Custom Sharding
You can also define a custom sharding strategy by specifying a function to compute residency of records. To do this we use the `setResidency` method, providing a function that will determine the residency of each record. The function you provide will be called with the record entry, and should return an array of nodes that the record should be replicated to (using their hostname). For example, to shard records based on the value of the `id` field, you can use the following code: 
```javascript
MyTable.setResidency((record) => {
  return record.id % 2 === 0 ? ['node1'] : ['node2'];
});
```