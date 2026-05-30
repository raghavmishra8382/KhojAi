const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('⚠️ WARNING: GEMINI_API_KEY is missing in .env file. Semantic matching will be disabled.');
}

const genAI = new GoogleGenerativeAI(apiKey || 'missing_key');

async function generateEmbedding(item) {
  // Combine fields into a single text string
  const textToEmbed = `${item.title || ''} ${item.description || ''} ${item.category || ''} ${item.location || ''}`.trim();
  
  if (!textToEmbed) {
    return [];
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-2"});
    const result = await model.embedContent(textToEmbed);
    return result.embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    // Return empty array to not block item creation if AI fails
    return [];
  }
}

module.exports = { generateEmbedding };
