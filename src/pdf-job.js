const pdf = require('./pdf.js');
const upload = require('./upload.js');
const hook = require('./hook.js');

const crypto = require('crypto');

function generateFileName(data,name){
  //const hash = crypto.createHash('md5').update(data).update(name).digest('hex');
  const hash = crypto.createHash('md5').update(JSON.stringify(data)).update(name).update(new Date()+'').digest('hex');
  return `${name}-${hash}.pdf`;
}

module.exports = async function pdfJob(job){
  const name = job.data.pdfParams.name || '';

  const filename = `${generateFileName(job.data,name)}`;

  const file = await pdf(job.data.pdfParams);

  const uploadResult = await upload(filename, file);

  const hookResult = await hook(uploadResult, job.data);

  console.log('hook result:', hookResult);

  return { maData: true };
}

