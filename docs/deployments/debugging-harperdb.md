# Debugging HarperDB

If your HarperDB servers are experiencing performance issues, memory leaks, or errors, enabling debugging can help diagnose the problem. To start debugging, ensure that the HarperDB configuration has debugging enabled.

To learn more, please visit: [HarperDB Configuration - Threads](https://docs.harperdb.io/docs/deployments/configuration#threads)

In most deployments, debugging is already enabled. If it's set up, you can connect to HarperDB using Node DevTools, available via `chrome://inspect` in Chrome (click "Open dedicated DevTools for Node").

## Port Configuration for Debugging

Since DevTools can only connect to one thread per port, we assign specific ports for debugging:

- Main thread: Port 9229
- Worker 1: Port 9230
- Worker 2: Port 9231
- And so on for additional worker threads.

To debug multiple threads, you'll need to register each port in DevTools:

1. In the "Connections" tab, click "Add connection."
2. Add `localhost:9230`, `localhost:9231`, and any other necessary ports.

## Connecting via SSH with Tunneling

When debugging a specific HarperDB instance, you’ll need to SSH into the instance using port tunneling. Here's how to connect to worker threads 1 and 2 (typically, debugging the main thread isn't needed since it doesn’t handle traffic):

```bash
ssh -L 9230:localhost:9230 -L 9231:localhost:9231 root@cool-customer.harperdbcloud.com
```

Once logged in, your DevTools should be able to connect to these threads for debugging.

## Debugging Tips

- Enable Pretty Printing: When debugging, be sure to enable pretty printing (bottom left of the code screen). This makes it easier to set breakpoints, even in HarperDB’s obfuscated code.

- Breakpoints in Application Code: If you're debugging your own application, just open the relevant file and set breakpoints as usual.


## Investigating Performance

- Run a Performance Profile: To investigate performance issues, start by running a profile for about 10-30 seconds. This will help you identify bottlenecks when analyzing the results.

- Check Memory Usage: For memory-related issues, take a heap snapshot to spot any large memory allocations. You can also compare heap usage over time to track memory growth or leaks.
