var { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
var { Upload } = require('@aws-sdk/lib-storage');
var { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { randomBytes } = require('crypto');

const bucketName = process.env.S3_BUCKET_NAME
const bucketRegion = process.env.AWS_REGION
const accessKey = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3Client = new S3Client({
    credentials:{
      accessKeyId: accessKey,
      secretAccessKey: secretAccessKey
    },
    region: bucketRegion
});

async function deleteFile(key) {
  const deleteParams = {
    Bucket: bucketName,
    Key: key,
  }

  return await s3Client.send(new DeleteObjectCommand(deleteParams));
}

async function getObjectSignedUrl(key) {
  const params = {
    Bucket: bucketName,
    Key: key
  }

  const command = new GetObjectCommand(params);
  const seconds = 360
  const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });

  return url
}

async function uploadFile(fileBuffer, mimetype) {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: bucketName,
      Key: randomBytes(32).toString('hex'),
      Body: fileBuffer,
      ContentType: mimetype
    },
  });

  upload.on('httpUploadProgress', (progress) => {
    console.log(progress);
  });

  try {
    const result = await upload.done();
    return result["Key"];
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

module.exports = {
  uploadFile : uploadFile,
  deleteFile : deleteFile,
  getObjectSignedUrl : getObjectSignedUrl,
}