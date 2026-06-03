const Item = require('../models/Item');
const cosineSimilarity = require('../utils/cosineSimilarity');

async function findMatches(item) {
  if (!item) {
    return [];
  }

  // Determine target type to match against
  const targetType = item.type === 'lost' ? 'found' : 'lost';

  // Fetch all items of the opposite type that have embeddings and are not resolved
  // Only consider active/open items
  const potentialMatches = await Item.find({
    type: targetType,
    status: 'open'
  }).populate('user', 'name');

  let matchesWithScores = potentialMatches.map(matchCandidate => {
    // First: strict pre-filters (rule-based) to reduce bad matches
    // 1) Category must match exactly (if either side has category info)
    if (item.category && matchCandidate.category && item.category.toLowerCase() !== matchCandidate.category.toLowerCase()) {
      return null; // reject immediately
    }

    // 2) Only consider active/open items (ensured by DB query), but guard again
    if (matchCandidate.status && matchCandidate.status !== 'open') {
      return null;
    }

    // 3) Prefer same location/campus; treat as a soft filter (we'll score it)

    // Semantic (embedding/description) similarity (fallback to title heuristics)
    let semanticSimilarity = 0;
    if (item.embedding && item.embedding.length > 0 && matchCandidate.embedding && matchCandidate.embedding.length > 0) {
      semanticSimilarity = cosineSimilarity(item.embedding, matchCandidate.embedding);
    } else {
      const title1 = item.title ? item.title.toLowerCase() : '';
      const title2 = matchCandidate.title ? matchCandidate.title.toLowerCase() : '';
      if (title1 && title2 && (title1.includes(title2) || title2.includes(title1))) {
        semanticSimilarity = 0.8;
      } else if (title1 && title2) {
        const words1 = title1.split(/\s+/);
        const words2 = title2.split(/\s+/);
        const commonWords = words1.filter(w => words2.includes(w));
        if (commonWords.length >= 2 || (words1.length === 1 && commonWords.length === 1)) {
          semanticSimilarity = 0.6;
        }
      }
    }

    // Scoring components
    // Category: binary (we already required match above, so this will be 1 when present)
    const categoryMatchScore = (item.category && matchCandidate.category && item.category.toLowerCase() === matchCandidate.category.toLowerCase()) ? 1 : 0;

    // Brand: encourage match, penalize explicit mismatch. If brand missing on either side, treat as neutral (0.5)
    let brandMatchScore = 0.5;
    if (item.brand && matchCandidate.brand) {
      brandMatchScore = item.brand.toLowerCase() === matchCandidate.brand.toLowerCase() ? 1 : 0;
    }

    // Location: exact match gives full score, otherwise 0
    const locationMatchScore = (item.location && matchCandidate.location && item.location.toLowerCase() === matchCandidate.location.toLowerCase()) ? 1 : 0;

    // Final weighted formula (as requested):
    // 40% Category, 25% Brand, 20% Location, 15% Semantic/Description
    const finalScore = (0.40 * categoryMatchScore) + (0.25 * brandMatchScore) + (0.20 * locationMatchScore) + (0.15 * semanticSimilarity);

    const similarityPercentage = Math.round(finalScore * 100);
    let confidenceLabel = 'Weak Match';
    if (similarityPercentage >= 85) {
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

  // Filter out low quality matches (show only meaningful matches e.g., >= 70%)
  const validMatches = matchesWithScores.filter(match => match.similarityPercentage >= 70);

  // Return top 5 matches
  return validMatches.slice(0, 5);
}

module.exports = { findMatches };
