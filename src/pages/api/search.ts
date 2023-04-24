// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createEmbedding, openai } from "@/utils/openai";
import { pinecone } from "@/utils/pinecone";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = JSON.parse(req.body);

  // Create embedding for user query
  const embeddingResponse = await createEmbedding(query);
  const { embedding } = embeddingResponse.data.data[0];

  const index = pinecone.Index("organizations");
  const queryResponse = await index.query({
    queryRequest: {
      vector: embedding,
      includeMetadata: true,
      topK: 3,
    },
  });

  if (!queryResponse.matches || !queryResponse.matches?.length) {
    throw Error("No organizations found");
  }

  // Use the best result as the context for chat completion.
  const chatCompletionResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: [
          "You are a helpful assistant.",
          "Use the text provided to form your answer, but avoid copying word-for-word from the prompt.",
          "Try to use your own words when possible.",
          "Your responses should be concise and straight to the point.",
          "The organization data is a JSON object:",
          JSON.stringify(queryResponse.matches[0].metadata),
        ].join("\n"),
      },
      // User prompt
      {
        role: "user",
        content: `Question: ${query}`,
      },
    ],
    temperature: 0.3,
  });
  const content = chatCompletionResponse.data.choices[0].message?.content;

  res.status(200).json({ message: content });
}
