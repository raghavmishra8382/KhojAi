const Item = require('../models/Item');
const cosineSimilarity = require('../utils/cosineSimilarity');

async function findMatches(item) {
  if (!item || !item.embedding || item.embedding.length === 0) {
    return [];
  }

  // Determine target type to match against
  const targetType = item.type === 'lost' ? 'found' : 'lost';

  // Fetch all items of the opposite type that have embeddings
  const potentialMatches = await Item.find({
    type: targetType,
    embedding: { $ne: [], $exists: true }
  }).populate('user', 'name');

  const matchesWithScores = potentialMatches.map(matchCandidate => {
    // 1. Semantic Similarity
    const semanticSimilarity = cosineSimilarity(item.embedding, matchCandidate.embedding);
    
    // 2. Category Match
    const categoryMatchScore = (item.category && matchCandidate.category && item.category === matchCandidate.category) ? 1 : 0;
    
    // 3. Location Match (Simple exact match for now)
    const locationMatchScore = (item.location && matchCandidate.location && item.location.toLowerCase() === matchCandidate.location.toLowerCase()) ? 1 : 0;
    
    // Final Score Formula
    const finalScore = (0.7 * semanticSimilarity) + (0.2 * categoryMatchScore) + (0.1 * locationMatchScore);
    
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

  // Sort by highest score first
  matchesWithScores.sort((a, b) => b.score - a.score);

  // Return top 5 matches
  return matchesWithScores.slice(0, 5);
}

module.exports = { findMatches };
