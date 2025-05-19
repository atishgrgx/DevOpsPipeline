require('dotenv').config({ path: __dirname + '/../.env' }); // Ensure .env loads
const { decrypt } = require('./encryptor');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // Update if needed
const client = new MongoClient(uri);
const dbName = 'jukeboxApp';

async function loadAwsCredentials() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const config = await db.collection('app_config').findOne({ _id: 'aws_keys' });

    if (!config) throw new Error('AWS credentials not found in DB');

    return {
      accessKeyId: decrypt(config.aws_access_key_id),
      secretAccessKey: decrypt(config.aws_secret_access_key),
      region: config.region || 'us-east-1'
    };
  } finally {
    await client.close();
  }
}

module.exports = loadAwsCredentials;
