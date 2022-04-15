const express = require('express')
const fileUpload = require('express-fileupload');
const app = express();

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : './tmp/',
  debug:true
}));

app.post('/filehook', function (req, res) {

  console.log( req.files.pdf );
  res.send('done');
})

app.listen(3000, () => console.log("Upload Test Server started!"));
