function cosineSimilarity(vec1, vec2) {
    const dotProduct = vec1.reduce((sum, v1, i) => sum + v1 * vec2[i], 0);
    const normA = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
    const normB = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
    return dotProduct / (normA * normB);
}
  