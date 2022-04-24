# bakso-doc

### Start Express
```
NO_QUEUE=false node src/index.js
```

### Start Queue Worker
```
node src/worker.js
```

### Start Redis
```
redis-server /usr/local/etc/redis.conf
```

### Queue a Job

The entire body of this request will be passed back to the hook when the job is completed.

```
curl -X POST -H "Content-Type: application/json" -d @test/11-17-poster-params.json http://localhost:5000/job
```

### Test PDF Output without Queue - Save a File using CURL
```
curl -X POST -H "Content-Type: application/json" --output test.pdf -d @test/11-17-poster-params.json http://localhost:5000/download
```

### Test Google Cloud Upload File Hook

Start the hook endpoint test server
```
node test/test-hook-endpoint.js
```

Create the uploads folder
```
mkdir tmp
```
