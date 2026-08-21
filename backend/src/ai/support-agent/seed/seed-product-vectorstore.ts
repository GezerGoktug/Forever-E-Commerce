import callGoogleGenAIEmbeddingsModel from "../models/embeddings";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoClient } from "mongodb";
import { Product } from "../../../models/Product.schema";
import { IProduct } from "../../../types/types";

const createSummaryByProduct = (product: Omit<IProduct, "_id">) => {
  return ` Product Name: ${product.name}
  Description: ${product.description}
  Category: ${product.category}
  Sub Category: ${product.subCategory}
  Price: ${product.price} USD
  Sizes: ${product.sizes.join(", ")}
  Images: ${product.image}, ${product.subImages.join(", ")}`;
};

export const createVectorIndex = async (client: MongoClient) => {
  const vectorSearchIdx = {
    name: "vector_index",
    type: "vectorSearch",
    definition: {
      fields: [
        {
          type: "vector",
          path: "embedding",
          numDimensions: 3072,
          similarity: "cosine",
        },
      ],
    },
  };

  await client.db("e-commerce")
    ?.collection("products")
    .createSearchIndex(vectorSearchIdx);

  console.log("✅ MongoDB vector index oluşturuldu!");
};

export class ProductsVectorStore {
  private static readonly embeddingModel: GoogleGenerativeAIEmbeddings =
    callGoogleGenAIEmbeddingsModel;

  /** Ürünleri seed et (ilk kurulum veya update) */
  public static async seedProductsVectorSctore() {

    const mongoClient = new MongoClient(process.env.MONGO_URI as string);
    await mongoClient.connect();
    // await createVectorIndex(mongoClient);

    const products = await Product.find().select("-comments.user -embedding");

    for (const doc of products) {
      console.log(`İşleniyor: ${doc.name}`);

      const summary = createSummaryByProduct(doc as  Omit<IProduct, "_id">);

      const embedding = await this.embeddingModel.embedQuery(summary);

      await Product.updateOne(
        { _id: doc._id },
        {
          $set: {
            embedding: embedding,
            embedding_text: summary
          }
        }
      );

    }

    await mongoClient.close();

  }

  public static getEmbeddingModel() {
    return this.embeddingModel;
  }
}
