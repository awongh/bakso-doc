const HOOK_URL = process.env.HOOK_URL || 'http://localhost:3000/filehook';
const axios = require('axios').default;

module.exports = async function hook(fileUrl){

  try{
    const result = await axios.post(HOOK_URL, {
      fileUrl
    })

    return result;
  }catch(e){
    console.log("hook post error", e);
  }

  return true;
};
