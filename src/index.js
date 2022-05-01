require('dotenv').config()
const express = require('express');
const pdf = require('./pdf.js');

// Serve on PORT on Heroku and on localhost:5000 locally
const PORT = process.env.PORT || '5000';

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
  const file = await pdf(req.body.pdfParams);
  res.send(file);
});

app.listen(PORT, () => console.log("Server started!"));
