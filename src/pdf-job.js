const pdf = require('./pdf.js');
const upload = require('./upload.js');
const hook = require('./hook.js');

const crypto = require('crypto');

function generateFileName(data,name){
  //const hash = crypto.createHash('md5').update(data).update(name).digest('hex');
  const hash = crypto.createHash('md5').update(data).update(name).update(new Date()).digest('hex');
  return `${hash}-${name}.pdf`;
}

module.exports = async function pdfJob(job, jobDone){
  console.log('ffff',job.data)

  // see if we need to deal with a file
  if( job.data.hookUrl ){
    //pdfOptions.path = `${generateFileName(job.data,name)}`;
  }

  const file = await pdf(job.data.pdfParams);
  console.log("DONE %*%*%*%*%*%*%%*%*%*%*%*%*%*%*%%*%*%*%*", file);

  //const bucket = "bakso_upload_test";
  //const name ="test-"+Math.random;
  //const uploadResult = await upload(bucket, name, file);
  //console.log(uploadResult);

  const hookOptions = {};
  const hookResult = await hook(file);

  console.log("DONE");

  return { maData: true };
}
