# Install HarperDB on Windows 10

Running HarperDB on Windows 10 is a great way to test and develop with HarperDB. We do not, though, recommend HarperDB on Windows for production workloads.

---

Install HarperDB on Windows

```bash
npm install -g harperdb
harperdb install --TC_AGREEMENT "yes" --HDB_ROOT "/home/ubuntu/hdb" --SERVER_PORT "9925" --HDB_ADMIN_USERNAME "HDB_ADMIN" --HDB_ADMIN_PASSWORD "abc123!"
````
HarperDB will automatically start after installation. For more information visit the [HarperDB Command Line Interface guide](https://harperdb.io/docs/administration/harperdb-cli/).