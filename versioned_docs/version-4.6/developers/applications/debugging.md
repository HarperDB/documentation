---
title: Debugging Applications
---

# Debugging Applications

By now, you’ve built your first application and even added some data. But what if something doesn’t behave the way you expect? Debugging in Harper is meant to feel natural—you don’t need to set up complex tooling just to figure out what’s wrong. Let’s walk through how to spot issues and fix them quickly.

## Start in Dev Mode

The easiest way to debug is to run your application in development mode:

```bash
harperdb dev .
```

When Harper is in dev mode, a few things happen that make life easier:

- Your app automatically reloads when you save changes.
- Errors and logs show up immediately in your console.
- Everything runs in a single-threaded mode—not what you’d use in production, but perfect for troubleshooting.

:::info
Try it out: save a small change to your schema or code. Notice how Harper restarts for you and streams the output straight to your terminal. If something goes wrong, you’ll see it instantly.
:::

## Attach a Debugger
Since Harper is just a Node.js process, you can connect your favorite JavaScript debugger when running in dev mode. It automatically opens on port `9229`, so you can set breakpoints and step through your application just like you would in any other Node project.

For example, if you’re trying to understand why a request to `/Dog/` isn’t returning what you expect, attach a debugger, drop a breakpoint, and inspect the state.

## Log What Matters
Often, you don’t need a full debugger session—logs will do the job. Every Harper application has a global `logger` you can call at different levels:

```javascript
logger.debug('Checking Dog record load');
logger.info('Dog created successfully');
logger.error('Dog creation failed');
```

Each level serves a purpose: trace the small details, warn about recoverable problems, or flag something critical with `fatal`. And if you need something that always shows up no matter what, use `notify`.

The current log level is defined in your Harper configuration, so you’re in control of how much detail you see while you debug.

## Where to Find Logs
In addition to the console output, Harper also writes logs to disk. By default, they’re here:

```bash
~/hdb/log/hdb.log
```

If you’ve set a custom Harper root, check the `log/` folder inside it. You can also read logs from the Studio Status page or query them directly with the `read_log` operation.