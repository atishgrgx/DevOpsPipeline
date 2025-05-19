require('dotenv').config({ path: __dirname + '/../.env' });
const { decrypt } = require('./encryptor');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URL; // ✅ Use your Atlas cluster URI
const client = new MongoClient(uri);
const dbName = 'JUKEBOXDB'; // ✅ Your Atlas DB name

async function loadAwsCredentials() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const config = await db.collection('app_config').findOne({ _id: 'aws_keys' });

    if (!config) throw new Error('AWS credentials not found in MongoDB');

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
