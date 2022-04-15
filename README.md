# bakso-pdf

### Start Express
```
nodemon src/index.js
```

### Start Worker
```
node src/worker.js
```

### Start Redis
```
redis-server /usr/local/etc/redis.conf
```


### Queue a Job
```
curl -X POST -H "Content-Type: application/json" -d @test/test-params.json http://localhost:5000/job
```

### Test Upload File Hook

Start the endpoint test server
```
node test/test-hook-endpoint.js
```

Create the uploads folder
```
mkdir tmp
```
