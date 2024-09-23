import { pipeline } from '@huggingface/transformers';
import { encode } from 'sentence-transformers';

const getTextEmbedding = async (text) => {
  const model = await pipeline('feature-extraction', 'sentence-transformers/all-MiniLM-L6-v2');
  const embedding = model(text); // Convert text to vector embeddings
  return embedding[0]; // The first (and only) result will be our embedding
};
