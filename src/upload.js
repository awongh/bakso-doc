// Import required AWS SDK clients and commands for Node.js.
const AWSSDKClient = require("@aws-sdk/client-s3");
const { S3Client, PutObjectCommand } = AWSSDKClient;

// Set the AWS Region.
const REGION = process.env.AWS_REGION || "us-east-1"; //e.g. "us-east-1"

const client = new S3Client({ region: REGION });

module.exports = async function(bucket, name, data){
  // Create an object and upload it to the Amazon S3 bucket.
  try {

    // Set the parameters
    const params = {
      Bucket: bucket, // The name of the bucket. For example, 'sample_bucket_101'.
      Key: name, // The name of the object. For example, 'sample_upload.txt'.
      Body: data, // The content of the object. For example, 'Hello world!".
    };

    const results = await client.send(new PutObjectCommand(params));

    console.log(
        "Successfully created " +
        params.Key +
        " and uploaded it to " +
        params.Bucket +
        "/" +
        params.Key
    );

    return results; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};
