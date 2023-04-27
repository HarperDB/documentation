The primary way that JavaScript code can interact with HarperDB is through the `harperdb` module. This module exports several objects and classes that provide access to the tables, server hooks, and resources that HarperDB provides for building applications. If you are using EcmaScript modules you can import function from `harperdb` like:
```javascript
import { tables, Resource } from 'harperdb';
```
Or if you are using CommonJS format for your modules:
```javascript
const { tables, Resource } = require('harperdb');
```

The `harperdb` has several exports that you can import including:

## `tables`
This is an object that holds all the tables for the default database (called `data`) as properties. Each of these property values is a table class that subclasses the Resource interface and provides access to the table through the Resource interface. For example, you can get a record from a table (in the default database) called 'my-table' with:

```javascript
import { tables } from 'harperdb';
async function getRecord() {
	let MyTable = tables.MyTable;
	let record = await tables.MyTable.get(recordId);
}
```
Note that the property names