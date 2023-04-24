import { Configuration, CreateEmbeddingRequestInput, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);

export function createEmbedding(input: CreateEmbeddingRequestInput) {
  return openai.createEmbedding({
    input,
    model: "text-embedding-ada-002",
  });
}
