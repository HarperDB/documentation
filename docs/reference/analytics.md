# Analytics

HarperDB provides extensive telemetry and analytics data to help monitor the status of the server and work loads, and to help understand traffic and usage patterns to identify issues and scaling needs, and identify queries and actions that are consuming the most resources.

HarperDB collects statistics for all operations, URL endpoints, and messaging topics, aggregating information by thread, operation, resource, and methods, in real-time. These statistics are logged in the `hdb_analytics` table in the `system` database.

There are two "levels" of analytics in the HarperDB analytics table: the first is the immediate level of direct logging of real-time statistics. These analytics entries are recorded once a second (when there is activity) by each thread, and include all recorded activity in the last second, along with system resource information. The records have a primary key that it is the timestamp in milliseconds since eopch.

The second level of analytics recording is aggregate data. The aggregate records are recorded once a minute, and aggregate the results from all the per-second entries from all the threads, creating a summary statistics once a minute.