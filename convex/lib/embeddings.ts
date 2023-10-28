import { query } from "../_generated/server";

export async function fetchEmbeddingBatch(texts: string[]) {
  const start = Date.now();
  const result = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.OPENAI_API_KEY,
    },

    body: JSON.stringify({
      model: "text-embedding-ada-002",
      input: texts.map((text) => text.replace(/\n/g, " ")),
    }),
  });
  const embeddingMs = Date.now() - start;

  const jsonresults = await result.json();
  if (jsonresults.data.length !== texts.length) {
    console.error(result);
    throw new Error("Unexpected number of embeddings");
  }
  const allembeddings = jsonresults.data as {
    embedding: number[];
    index: number;
  }[];
  allembeddings.sort((a, b) => a.index - b.index);
  return {
    embeddings: allembeddings.map(({ embedding }) => embedding),
    totalTokens: jsonresults.usage.total_tokens,
    embeddingMs,
  };
}

export async function fetchEmbedding(text: string) {
  const { embeddings, ...stats } = await fetchEmbeddingBatch([text]);
  return { embedding: embeddings[0], ...stats };
}

export const envCheck = query(async () => {
  return {
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
  };
});
