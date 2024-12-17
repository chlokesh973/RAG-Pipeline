const { PineconeClient } = require('@pinecone-database/pinecone');

async function initializePinecone() {
  const pinecone = new PineconeClient();
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENV, // Example: 'us-west1-gcp'
  });
  return pinecone.Index('pdf-query-index');
}

module.exports = { initializePinecone };
