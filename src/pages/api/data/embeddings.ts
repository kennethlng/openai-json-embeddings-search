// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createEmbedding } from "@/utils/openai";
import { pinecone } from "@/utils/pinecone";
import type { NextApiRequest, NextApiResponse } from "next";
import data from "../../../data/organizations.json";

const PINECONE_INDEX = "organizations";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Create an embedding for each organization object in
  // the data json file.
  // The following string interpolation
  // was created by OpenAI using chat.openai.com. You can do
  // this yourself with your own data schema by giving GPT
  // an example of what your data looks like and asking it
  // to write a script that formats your data into a natural
  // language format.
  const embeddingResponse = await createEmbedding(
    data.map(
      (org) =>
        `${org.name} is a ${org.industry} company founded in ${
          org.founded_year
        }. It has ${
          org.estimated_num_employees
        } employees and its market cap is ${
          org.market_cap
        }. The company is headquartered in ${org.city}, ${org.state}, ${
          org.country
        }. The address is ${org.street_address}, ${org.city}, ${org.state}, ${
          org.postal_code
        }. The company's website is ${
          org.website_url
        }. Its main keywords are ${org.keywords.join(", ")}.`
    )
  );
  const embeddingResults = embeddingResponse.data.data;

  // If the index doesn't exist in pinecone, create one
  const pineconeIndices = await pinecone.listIndexes();
  if (!pineconeIndices.includes(PINECONE_INDEX)) {
    await pinecone.createIndex({
      createRequest: {
        name: PINECONE_INDEX,
        metric: "cosine",
        dimension: embeddingResults[0].embedding.length,
      },
    });

    console.log("Pinecone index created");
  }

  // Populate pinecone with the openai embeddings
  const index = await pinecone.Index(PINECONE_INDEX);
  const upsertResponse = await index.upsert({
    upsertRequest: {
      vectors: data.map((org, i) => ({
        id: org.id,
        values: embeddingResults[i].embedding,
        metadata: org,
      })),
    },
  });

  res.status(200).json({
    message: `${upsertResponse.upsertedCount} vectors upserted to the ${PINECONE_INDEX} index.`,
  });
}
