# Authentication

HarperDB utilizes Basic Auth to secure our REST requests.  In the context of an HTTP transaction, **basic access authentication** is a method for an HTTP user agent to provide a user name and password when making a request.



** ***You do not need to log in separately. Basic Auth is added to each REST request like create_schema, create_table, insert etc… via headers.*** **



A header is added to each REST request.  The header key is **“Authorization”** the header value is **“Basic <<your username and password buffer token>>”**





## Using HarperDB Studio

Below is a code sample from HarperDB Studio.  On Line 14 you will see where we are adding the authorization header to each request.  Again this needs to be added for each and every REST request for HarperDB.

```bash
function callHarperDB(call_object,operation,  callback){

    var options = {
        "method": "POST",
        "hostname": call_object.endpoint_url,
        "port": call_object.endpoint_port,
        "path": "/",
        "headers": {
            "content-type": "application/json",
            "authorization": "Basic " + Buffer.from(call_object.username + ':' + call_object.password).toString('base64'),
            "cache-control": "no-cache"

        }
    };

    var http_req = http.request(options, function (hdb_res) {
        var chunks = [];

        hdb_res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        hdb_res.on("end", function () {
            var body = Buffer.concat(chunks);
            if (isJson(body)) {
               return callback(null, JSON.parse(body));
            } else {
               return callback(body, null);

            }

        });
    });

    http_req.on("error", function (chunk) {
        return callback("Failed to connect", null);
    });

    http_req.write(JSON.stringify(operation));
    http_req.end();

}
```