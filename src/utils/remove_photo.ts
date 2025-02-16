const S3 = require('aws-sdk/clients/s3');
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region: region,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

export const remove_photo = (url: string) => {
  const parts = url.split('/');
  const name = parts[parts.length - 1];
  const params = {
    Bucket: bucketName,
    Key: name,
  };
  return s3.deleteObject(params).promise();
};
