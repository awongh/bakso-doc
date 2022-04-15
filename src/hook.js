// node-fetch implements FormData, but it doesn't work for some reason- need this node pkg instead
const FormData = require('form-data');

const HOOK_URL = process.env.HOOk_URL || 'http://localhost:3000/filehook';

module.exports = async function hook(file){

  // axios doesn't work for some reason
  // newest version of node-fetch is import-only
  const {
    default: fetch,
  } = await import('node-fetch');

  try{

    const formData = new FormData();

    const fileSizeInBytes = Buffer.byteLength(file);

    formData.append( 'pdf', file, {
      filename: 'fake.pdf',
      contentType: 'application/pdf',
      knownLength: fileSizeInBytes
    } );

    const result = await fetch(HOOK_URL, {
        method: 'POST',
        headers: {
            "Content-length": fileSizeInBytes
        },
        body: formData
    })

    return result;
  }catch(e){
    console.log("hook post error", e);
  }

  return true;
};
