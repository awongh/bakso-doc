const pdf = require('./pdf.js');
// const upload = require('./upload.js');

module.exports = function pdfJob(job, jobDone){
  // create pdf

  // upload it to s3

  // postRequest to the hook url the s3 url
  // return { value: "This will be stored" };
  console.log("PDF job")
  console.log('********** Job done by worker', job, job.id);

  const file = pdf();

  // do stuff
  console.log( job.data );

  return { maData: true };
}
