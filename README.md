# bakso-doc

## Quick Start w/ Localhost

Clone the repo.

`cd` into the directory.


Start the Bakso Docs server:

```
node src/index.js
```

Make a request to save a file to the repo directory:
```
curl -X POST -H "Content-Type: application/json" --output test.pdf -d @test/11-17-poster-params.json http://localhost:5000/download
```

## How To:

### Start Express
```
node src/index.js
```

### Test PDF Output without Queue - Save a File using CURL
```
curl -X POST -H "Content-Type: application/json" --output test.pdf -d @test/11-17-poster-params.json http://localhost:5000/download
```
