const HOOK_URL = process.env.HOOK_URL || 'http://localhost:3000/filehook';
const axios = require('axios').default;

module.exports = async function hook(fileUrl, jobData){

  try{
    const result = await axios.post(HOOK_URL, {
      jobData,
      fileUrl
    })

    return result;
  }catch(e){
    console.log("hook post error", e);
  }

  return true;
};
