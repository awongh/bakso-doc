const pdf = require('./pdf.js');
const upload = require('./upload.js');
const hook = require('./hook.js');

module.exports = async function pdfJob(job, jobDone){
  // create pdf

  // upload it to s3

  // postRequest to the hook url the s3 url
  // return { value: "This will be stored" };
  console.log('********** Job by worker', job, job.id);
  console.log("PDF job")

  console.log("DTAA job")
  console.log( job.data );

  const file = await pdf();

  const bucket = "bakso_upload_test";
  const name ="test-"+Math.random;

  //const uploadResult = await upload(bucket, name, file);
  const hookResult = await hook(filePath);

  console.log("DONE");
  //console.log(uploadResult);

  return { maData: true };
}
