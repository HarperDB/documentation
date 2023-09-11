# `http`

`threads` - _Type_: number; _Default_: One less than the number of logical cores/ processors

The `threads` option specifies the number of threads that will be used to service the HTTP requests for the operations API and custom functions. Generally, this should be close to the number of CPU logical cores/processors to ensure the CPU is fully utilized (a little less because HarperDB does have other threads at work), assuming HarperDB is the main service on a server.

```yaml
http:
  threads: 11
```

`sessionAffinity` - _Type_:  string; _Default_: null

HarperDB is a multi-threaded server designed to scale to utilize many CPU cores with high concurrency. Session affinity can help improve the efficiency and fairness of thread utilization by routing multiple requests from the same client to the same thread. This provides a fairer method of request handling by keeping a single user contained to a single thread, can improve caching locality (multiple requests from a single user are more likely to access the same data), and can provide the ability to share information in-memory in user sessions. Enabling session affinity will cause subsequent requests from the same client to be routed to the same thread.

To enable `sessionAffinity`, you need to specify how clients will be identified from the incoming requests. If you are using HarperDB to directly serve HTTP requests from users from different remote addresses, you can use a setting of `ip`. However, if you are using HarperDB behind a proxy server or application server, all the remote ip addresses will be the same and HarperDB will effectively only run on a single thread. Alternately, you can specify a header to use for identification. If you are using basic authentication, you could use the "Authorization" header to route requests to threads by the user's credentials. If you have another header that uniquely identifies users/clients, you can use that as the value of sessionAffinity. But be careful to ensure that the value does provide sufficient uniqueness and that requests are effectively distributed to all the threads and fully utilizing all your CPU cores.
```yaml
http:
  sessionAffinity: ip
```
