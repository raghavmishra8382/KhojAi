const Item = require('../models/Item');
const cosineSimilarity = require('../utils/cosineSimilarity');

async function findMatches(item) {
  if (!item) {
    return [];
  }

  // Determine target type to match against
  const targetType = item.type === 'lost' ? 'found' : 'lost';

  // Fetch all items of the opposite type that have embeddings and are not resolved
  const potentialMatches = await Item.find({
    type: targetType,
    status: 'open'
  }).populate('user', 'name');

  let matchesWithScores = potentialMatches.map(matchCandidate => {
    // Strict rule-based filtering before AI scoring
    if (item.category && matchCandidate.category && item.category.toLowerCase() !== matchCandidate.category.toLowerCase()) {
      return null; // Reject if categories don't match
    }
    // We no longer strictly reject based on itemType since "Earbuds" != "Wireless Earbuds"


    // 1. Semantic Similarity
    let semanticSimilarity = 0;
    if (item.embedding && item.embedding.length > 0 && matchCandidate.embedding && matchCandidate.embedding.length > 0) {
      semanticSimilarity = cosineSimilarity(item.embedding, matchCandidate.embedding);
    } else {
      // Fallback: If embeddings are missing, use simple title matching
      const title1 = item.title ? item.title.toLowerCase() : '';
      const title2 = matchCandidate.title ? matchCandidate.title.toLowerCase() : '';
      if (title1 && title2 && (title1.includes(title2) || title2.includes(title1))) {
        semanticSimilarity = 0.8;
      } else if (title1 && title2) {
        // Simple word match check if includes fails (e.g. "OnePlus Black Earbuds" vs "OnePlus Earbuds")
        const words1 = title1.split(/\s+/);
        const words2 = title2.split(/\s+/);
        const commonWords = words1.filter(w => words2.includes(w));
        if (commonWords.length >= 2 || (words1.length === 1 && commonWords.length === 1)) {
           semanticSimilarity = 0.6;
        }
      }
    }
    
    // 2. Category Match (always 1 if we passed the strict filter, but good for legacy items)
    const categoryMatchScore = (item.category && matchCandidate.category && item.category.toLowerCase() === matchCandidate.category.toLowerCase()) ? 1 : 0;
    
    // 3. Location Match
    const locationMatchScore = (item.location && matchCandidate.location && item.location.toLowerCase() === matchCandidate.location.toLowerCase()) ? 1 : 0;
    
    // 4. Brand Match (Huge improvement factor)
    const brandMatchScore = (item.brand && matchCandidate.brand && item.brand.toLowerCase() === matchCandidate.brand.toLowerCase()) ? 1 : 0;

    // 5. Color Match
    const colorMatchScore = (item.color && matchCandidate.color && item.color.toLowerCase() === matchCandidate.color.toLowerCase()) ? 1 : 0;

    // 6. Item Type Match
    const itemTypeMatchScore = (item.itemType && matchCandidate.itemType && item.itemType.toLowerCase() === matchCandidate.itemType.toLowerCase()) ? 1 : 0;

    // Final Score Formula (Weight adjusted to include brand and color)
    const finalScore = (0.45 * semanticSimilarity) + (0.15 * categoryMatchScore) + (0.1 * brandMatchScore) + (0.1 * colorMatchScore) + (0.1 * locationMatchScore) + (0.1 * itemTypeMatchScore);
    
    // Determine Confidence Label based on percentage
    const similarityPercentage = Math.round(finalScore * 100);
    let confidenceLabel = 'Weak Match';
    if (similarityPercentage > 85) {
      confidenceLabel = 'Strong Match';
    } else if (similarityPercentage >= 70) {
      confidenceLabel = 'Medium Match';
    }

    return {
      itemDetails: matchCandidate,
      similarityPercentage,
      confidenceLabel,
      score: finalScore
    };
  });

  // Filter out any nulls from strict rejections
  matchesWithScores = matchesWithScores.filter(match => match !== null);

  // Sort by highest score first
  matchesWithScores.sort((a, b) => b.score - a.score);

  // Filter out low quality matches (e.g., < 50%)
  const validMatches = matchesWithScores.filter(match => match.similarityPercentage >= 50);

  // Return top 5 matches
  return validMatches.slice(0, 5);
}

module.exports = { findMatches };
