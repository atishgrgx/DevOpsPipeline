require('dotenv').config(); // Load environment variables first

const AWS = require('aws-sdk');

// Configure AWS using .env variables
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const bucketName = 'deakinsarul'; 

// Upload chat messages to S3
function saveChatToS3(roomName, messages) {
  const key = `chats/${roomName}.json`;
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: JSON.stringify(messages, null, 2),
    ContentType: 'application/json'
  };

  return s3.putObject(params).promise()
    .then(() => console.log(`Saved chat for ${roomName} to S3`))
    .catch((err) => console.error(`S3 upload error:`, err));
}

//  Retrieve chat messages from S3
function loadChatFromS3(roomName) {
  const key = `chats/${roomName}.json`;
  const params = {
    Bucket: bucketName,
    Key: key
  };

  return s3.getObject(params).promise()
    .then((data) => {
      const messages = JSON.parse(data.Body.toString());
      console.log(`Loaded chat for ${roomName} from S3`);
      return messages;
    })
    .catch((err) => {
      if (err.code === 'NoSuchKey') {
        console.warn(`No chat history found for ${roomName}`);
        return [];
      }
      throw err;
    });
}



//  Save private chat between two users
function savePrivateChatToS3(user1, user2, messages) {
    const sorted = [user1, user2].sort(); // ensure consistent file name
    const key = `private_chats/${sorted[0]}_${sorted[1]}.json`;
  
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: JSON.stringify(messages, null, 2),
      ContentType: 'application/json'
    };
  
    return s3.putObject(params).promise()
      .then(() => console.log(`Saved private chat between ${user1} and ${user2} to S3`))
      .catch((err) => console.error(`Private S3 upload error:`, err));
  }
  
  //  Load private chat between two users
  function loadPrivateChatFromS3(user1, user2) {
    const sorted = [user1, user2].sort();
    const key = `private_chats/${sorted[0]}_${sorted[1]}.json`;
  
    const params = {
      Bucket: bucketName,
      Key: key
    };
  
    return s3.getObject(params).promise()
      .then((data) => JSON.parse(data.Body.toString()))
      .catch((err) => {
        if (err.code === 'NoSuchKey') {
          console.warn(`No private chat found in S3 for ${key}`);
          return [];
        } else {
          console.error(`Failed to load private chat:`, err);
          return [];
        }
      });
  }
  
  

  module.exports = {
    saveChatToS3,
    loadChatFromS3,
    savePrivateChatToS3,
    loadPrivateChatFromS3
  };