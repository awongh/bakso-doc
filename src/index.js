require('dotenv').config()
const retry = require('async-retry');
const express = require('express');
const pdf = require('./pdf.js');


// Serve on PORT on Heroku and on localhost:5000 locally
const PORT = process.env.PORT || '5500';

const app = express();
app.use(express.json())

/*
 * ========================================================
 * ========================================================
 *                    express.js routes
 * ========================================================
 * ========================================================
 */

app.post('/download', async (req, res) => {
  try{
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
