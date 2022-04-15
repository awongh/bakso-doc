const pdf = require('./pdf.js');
const upload = require('./upload.js');
const hook = require('./hook.js');

const crypto = require('crypto');

function generateFileName(data){
  //const hash = crypto.createHash('md5').update(data).update(name).digest('hex');
  const hash = crypto.createHash('md5').update(JSON.stringify(data)).update(new Date()+'').digest('hex');
  return `${hash}.pdf`;
}

module.exports = async function pdfJob(job){

  const filename = `${generateFileName(job.data)}`;

  const file = await pdf(job.data.pdfParams);

  const uploadResult = await upload(filename, file);

  const hookResult = await hook(uploadResult);

  console.log("DONE");

  return { maData: true };
}

