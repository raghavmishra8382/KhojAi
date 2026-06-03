const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Extracts item details from an image buffer using Gemini Vision.
 * @param {Buffer} buffer - The image buffer.
 * @param {String} mimeType - The MIME type of the image (e.g., 'image/jpeg').
 * @returns {Object} JSON object containing title, category, and description.
 */
const extractItemDetailsFromImage = async (buffer, mimeType) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      Analyze this image of a lost or found item.
      Extract the following information and return ONLY a valid JSON object:
      {
        "title": "A short, descriptive title (e.g. Black Leather Wallet)",
        "category": "Must be exactly one of: 'Electronics', 'Wallets & Cards', 'Bags', 'Keys', or 'Other'",
        "itemType": "A specific type like 'Earbuds', 'Laptop', 'Phone', 'Wallet', 'Backpack', etc.",
        "brand": "The brand name if visible or obvious (e.g. 'Apple', 'HP'), otherwise empty string",
        "color": "The primary color of the item",
        "description": "A detailed visual description including colors, branding, distinguishing marks, etc."
      }
      Do not include any markdown formatting like \`\`\`json or \`\`\`. Just return the raw JSON object.
    `;

    const imageParts = [
      {
        inlineData: {
          data: buffer.toString('base64'),
          mimeType
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text().trim();
    
    // Safely parse JSON in case model includes backticks despite prompt instructions
    let cleanJson = responseText;
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/```json/g, '').replace(/```/g, '').trim();
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/```/g, '').trim();
    }

    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Vision API Error:', error);
    throw new Error('Failed to extract details from image');
  }
};

module.exports = {
  extractItemDetailsFromImage
};
