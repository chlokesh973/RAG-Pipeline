const { GeminiClient } = require('gemini-api');  // If the correct package

// Initialize Gemini client
const gemini = new GeminiClient({
  apiKey: process.env.GEMINI_API_KEY,
});

async function getEmbedding(text) {
  try {
    const response = await geminiClient.getEmbeddings({
      model: "gemini-embedding-model",  // Use the correct embedding model name
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error getting embedding:', error);
    throw error;
  }
}

module.exports = { getEmbedding };