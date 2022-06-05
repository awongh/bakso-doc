require('dotenv').config()
const retry = require('async-retry');
const express = require('express');
const crypto = require('crypto');
const pdf = require('./pdf.js');


// Serve on PORT on Heroku and on localhost:5000 locally
const PORT = process.env.PORT || '5500';
const KEY = process.env.SECRET_KEY || 'hello world';

const app = express();
app.use(express.json())

/*
 * ========================================================
 * ========================================================
 *                    express.js routes
 * ========================================================
 * ========================================================
 */

function isKeyValid(key){
  const hashA = crypto.createHash('sha512');
  const dataA = hash.update(key, 'utf-8');

  const hashB = crypto.createHash('sha512');
  const dataB = hash.update(KEY, 'utf-8');

  return dataA.digest('hex') === dataB.digest('hex');
}

app.post('/download', async (req, res) => {
  try{

    // exit out if key doesn't match
    if(isKeyValid(req.body.key) === false) throw new Error;

    const file = await retry(
      async (bail, count) => {
        console.log(`tried ${count} times`);
        return await pdf(req.body.pdfParams);
      },
      {
        retries: 3,
      }
    );

    res.send(file);

  }catch(e){
    console.error(e);
    res.sendStatus(500);
  }

});

app.listen(PORT, () => console.log("Server started!"));
