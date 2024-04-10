var { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } = require("@aws-sdk/client-transcribe");
var { Upload } = require('@aws-sdk/lib-storage');
var { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { randomBytes } = require('crypto');
const axios = require('axios');

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

const transcribeClient = new TranscribeClient({ 
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

async function saveToS3andTranscript(fileBuffer, mimetype) {
  try {
    const key = await uploadFile(fileBuffer, mimetype);
    var fileUri = `s3://${bucketName}/${key}`
    const jobName = await startTranscriptionJob(fileUri);
    const transcriptionText = await waitForTranscriptionJob(jobName);
    console.log('Transcription Text:', transcriptionText);
    return {key, transcribe: transcriptionText};
  } catch (error) {
    console.error('Error in transcription process:', error);
  }
}

// Function to start a transcription job
async function startTranscriptionJob(fileUri) {
  const jobName = `TranscriptionJob-${Date.now()}`;
  const params = {
    TranscriptionJobName: jobName,
    LanguageCode: 'en-US',
    MediaFormat: 'mp3',
    Media: {
      MediaFileUri: fileUri
    },
  };

  try {
    const data = await transcribeClient.send(new StartTranscriptionJobCommand(params));
    console.log(`Transcription job started: ${jobName}`);
    return jobName;
  } catch (err) {
    console.error("Error starting transcription job: ", err);
    throw err;
  }
}

// Function to fetch and return transcription text using axios
async function getTranscriptionText(transcriptUri) {
  try {
    const response = await axios.get(transcriptUri);
    const transcriptionText = response.data.results.transcripts.map(transcript => transcript.transcript).join(' ');
    // Remove punctuation except for apostrophes and periods (you can adjust this as needed)
    let cleanedText = transcriptionText.replace(/[!@#$%^&*(),?":{}|<>]/g, '');

    // Convert numbers to words
    cleanedText = cleanedText.split(' ').map(word => {
      if (word.match(/^\d+$/)) {
        return writtenNumber(parseInt(word, 10));
      }
      return word;
    }).join(' ');
    return cleanedText;
  } catch (error) {
    console.error('Error fetching transcription result:', error);
    throw error;
  }
}

// Function to wait for transcription job completion and fetch the result
async function waitForTranscriptionJob(jobName) {
  const params = {
    TranscriptionJobName: jobName
  };

  let jobStatus = 'IN_PROGRESS';
  console.log('Waiting for transcription to complete...');

  while (jobStatus === 'IN_PROGRESS') {
    try {
      const data = await transcribeClient.send(new GetTranscriptionJobCommand(params));
      jobStatus = data.TranscriptionJob.TranscriptionJobStatus;
      if (jobStatus === 'COMPLETED') {
        console.log('Transcription completed.');
        return await getTranscriptionText(data.TranscriptionJob.Transcript.TranscriptFileUri);
      } else if (jobStatus === 'FAILED') {
        console.error('Transcription failed.');
        return null;
      }
      // Poll every 30 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (err) {
      console.error("Error checking transcription job status: ", err);
      throw err;
    }
  }
}

module.exports = {
  saveToS3andTranscript : saveToS3andTranscript,
  uploadFile : uploadFile,
  deleteFile : deleteFile,
  getObjectSignedUrl : getObjectSignedUrl,
}