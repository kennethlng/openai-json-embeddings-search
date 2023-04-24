import { PineconeClient } from "@pinecone-database/pinecone";

export const pinecone = new PineconeClient();
pinecone.init({
  environment: process.env.PINECONE_ENVIRONMENT as string,
  apiKey: process.env.PINECONE_API_KEY as string,
});
