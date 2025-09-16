---
title: Debugging Applications
---

# Debugging Applications

When you need to troubleshoot a Harper application, the fastest path is to run in development mode and check the logs. This page describes the debugging tools available, how to attach a debugger, and how to work with Harper logs.

## Running in Dev Mode

Start Harper in development mode with:

```
harperdb dev
# or to run and debug a specific app
harperdb dev /path/to/app
```

In dev mode:

- Harper reloads automatically when you edit files.
- Logs and errors are shown directly in the console.
- Harper runs in single-threaded mode, which is not for production use but makes debugging easier.

## Attaching a Debugger

Harper runs as a standard Node.js process. When started in dev mode, it opens the default Node.js debug port (9229). You can attach any JavaScript debugger to this process to set breakpoints and inspect state.

## Logging with the Global Logger

The global `logger` variable is available in all Harper applications. Use it to record messages at different levels:

```javascript
logger.trace('Trace-level details');
logger.debug('Debugging information');
logger.info('General information');
logger.warn('Non-critical problem');
logger.error('Error condition');
logger.fatal('Critical failure');
logger.notify('Always logged');
```

- The active log level is set in the Harper configuration file.
- `notify` messages always appear, regardless of the configured level.

## Log Locations

By default, logs are written to:

```bash
~/hdb/log/hdb.log
```

If you’ve customized the Harper root directory, logs can be found in the `log/` folder there. Logs are also viewable in the Studio Status page, or queryable with the `read_log` operation.
