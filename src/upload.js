const {Storage} = require('@google-cloud/storage');

//https://medium.com/@olamilekan001/image-upload-with-google-cloud-storage-and-node-js-a1cf9baa1876

const BUCKET_NAME = process.env.GOOGLE_STORAGE_BUCKET_NAME || 'bakso_test_bucket';

module.exports = async function upload(fileName, data){
  //https://github.com/googleapis/google-auth-library-nodejs#loading-credentials-from-environment-variables

  //https://stackoverflow.com/a/48373699/271932

  const storage = new Storage({
    project_id: process.env.GOOGLE_PROJECT_ID,
    credentials: JSON.parse(process.env.GOOGLE_JSON_KEY)
  });

  const ref = await storage.bucket(BUCKET_NAME).file(fileName);

  ref.save(data);

  const nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1))

  const config = {
    action: 'read',
    // A timestamp when this link will expire
    expires: `${nextYear.getFullYear()}-${nextYear.getMonth()+1}-${nextYear.getDate()}`
    //expires: '2026-12-13',
  };

  // https://www.geeksforgeeks.org/how-to-get-file-link-from-google-cloud-storage-using-node-js/
  return await ref.getSignedUrl(config)
}
