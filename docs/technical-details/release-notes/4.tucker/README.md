# Harper Tucker (Version 4)

HarperDB version 4 ([Tucker release](tucker.md)) represents major step forward in database technology. This release line has ground-breaking architectural advancements including:

## [4.4](4.4.0.md)

* Native replication (codename "Plexus") which is faster, more efficient, secure, and reliable than the previous replication system and provides provisional sharding capabilities with a foundation for the future
* Computed properties that allow applications to define properties that are computed from other properties, allowing for composite properties that are calculated from other data stored in records without requiring actual storage of the computed value
* Custom indexing including composite, full-text indexing, and vector indexing

## [4.3](4.3.0.md)

* Relationships, joins, and broad new querying capabilities for complex and nested conditions, sorting, joining, and selecting with significant query optimizations
* More advanced transaction support for CRDTs and storage of large integers (with BigInt)
* Better management with new upgraded local studio and new CLI features

## [4.2](4.2.0.md)

* New component architecture and Resource API for advanced, robust custom database application development
* Real-time capabilites through MQTT, WebSockets, and Server-Sent Events
* REST interface for intuitive, fast, and standards-compliant HTTP interaction
* Native caching capabilities for high-performance cache scenarios
* Clone node functionality

## [4.1](4.1.0.md)

* New streaming iterators mechanism that allows query results to be delivered to clients _while_ querying results are being processed, for incredibly fast time-to-first-byte and concurrent processing/delivery
* New thread-based concurrency model for more efficient resource usage

## [4.0](4.0.0.md)

* New clustering technology that delivers robust, resilient and high-performance replication
* Major storage improvements with highly-efficient adaptive-structure modified MessagePack format, with on-demand deserialization capabilities

Did you know our release names are dedicated to employee pups? For our fourth release, [meet Tucker!](tucker.md)
