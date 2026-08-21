import { tool } from "@langchain/core/tools";
import { ProductsVectorStore } from "../seed/seed-product-vectorstore";
import { Product } from "../../../models/Product.schema";
import { PipelineStage } from "mongoose";
import { IProduct } from "../../../types/types";
import logger from "../../../config/logger";


interface IProductLookupToolInput {
  query: string;
  n?: number;
  min_price?: number;
  max_price?: number;
  category?: ("Kids" | "Men" | "Women") | ("Kids" | "Men" | "Women")[];
  subCategory?: ("Topwear" | "Bottomwear" | "Winterwear") | ("Topwear" | "Bottomwear" | "Winterwear")[];
  sort_by?: "price_asc" | "price_desc" | "newest" | "rating_asc" | "rating_desc";
  page?: number;
}


export const productLookupTool = tool(
  async (input) => {
    const {
      query,
      n = 5,
      min_price,
      max_price,
      category,
      subCategory,
      sort_by,
    } = input as IProductLookupToolInput;

    const filter: any = {};
    if (min_price !== undefined || max_price !== undefined) {
      filter.price = {};
      if (min_price !== undefined) filter.price.$gte = min_price;
      if (max_price !== undefined) filter.price.$lte = max_price;
    }

    if (category) {
      if (Array.isArray(category)) filter.category = { $in: category };
      else if (category.trim().length > 0) filter.category = category;
    }

    if (subCategory) {
      if (Array.isArray(subCategory)) filter.subCategory = { $in: subCategory };
      else if (subCategory.trim().length > 0) filter.subCategory = subCategory;
    }


    let sortObj: Record<string, number> = {};
    if (sort_by === "price_asc") sortObj.price = 1;
    else if (sort_by === "price_desc") sortObj.price = -1;
    else if (sort_by === "newest") sortObj.createdAt = -1;

    logger.info("AI Chatbot Agent Product Tool Input:", input);

    const useVectorStore = !sort_by;

    let mapped: (IProduct & { averageRating?: number })[] = [];

    if (useVectorStore) {

      const embeddingModel = ProductsVectorStore.getEmbeddingModel();
      const embedding = await embeddingModel.embedQuery(query);

      const pipeline: PipelineStage[] = [
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: embedding,
            numCandidates: 100,
            limit: n,
            filter,
          },
        },
        {
          $addFields: {
            averageRating: { $avg: "$comments.rating" },
          },
        },
        {
          $sort: { averageRating: -1 },
        },
        {
          $project: {
            name: true,
            price: true,
            image: true,
            description: true,
            subImages: true,
            sizes: true,
            category: true,
            subCategory: true,
            averageRating: true,
            comments: {
              $slice: [
                { $sortArray: { input: "$comments", sortBy: { rating: -1 } } },
                5,
              ],
            },
          },
        },
      ];

      const aggregateResult = await Product.aggregate(pipeline);

      mapped = aggregateResult.map((item) => ({
        name: item.name,
        price: item.price,
        image: item.image,
        description: item.description,
        subImages: item.subImages,
        sizes: item.sizes,
        category: item.category,
        subCategory: item.subCategory,
        comments: item.comments,
        averageRating: item.averageRating || 0,
        _id: item._id.toString(),
      }));

    } else {
      if (sort_by === "rating_asc" || sort_by === "rating_desc") {
        const pipeline: PipelineStage[] = [
          { $match: filter },
          {
            $addFields: {
              averageRating: { $avg: "$comments.rating" },
            },
          },
          { $sort: { averageRating: sort_by === "rating_asc" ? 1 : -1 } },
          { $limit: n },
          {
            $project: {
              name: true,
              price: true,
              image: true,
              description: true,
              subImages: true,
              sizes: true,
              category: true,
              subCategory: true,
              comments: true,
              averageRating: true,
            },
          },
        ];

        const results = await Product.aggregate(pipeline);
        mapped = results.map((item) => ({
          name: item.name,
          price: item.price,
          image: item.image,
          description: item.description,
          subImages: item.subImages,
          sizes: item.sizes,
          category: item.category,
          subCategory: item.subCategory,
          comments: item.comments,
          averageRating: item.averageRating || 0,
          _id: item._id.toString(),
        }));

      } else {
        const pipeline: PipelineStage[] = [
          { $match: filter },
          {
            $addFields: {
              averageRating: { $avg: "$comments.rating" }
            }
          },
          { $sort: { ...sortObj as object } },
          {
            $project: {
              name: true,
              price: true,
              image: true,
              description: true,
              subImages: true,
              sizes: true,
              category: true,
              subCategory: true,
              averageRating: true,
              comments: {
                $slice: [
                  { $sortArray: { input: "$comments", sortBy: { rating: -1 as 1 | -1 } } },
                  5
                ]
              }
            }
          },
          { $limit: n }
        ];
        const aggregateResult = await Product.aggregate(pipeline);
        mapped = aggregateResult.map((item) => ({
          name: item.name,
          price: item.price,
          image: item.image,
          description: item.description,
          subImages: item.subImages,
          sizes: item.sizes,
          category: item.category,
          subCategory: item.subCategory,
          comments: item.comments,
          averageRating: item.averageRating || 0,
          _id: item._id.toString(),
        }));
      }
    }

    if (!mapped.length) {
      return { message: "No products match your criteria.", products: [] };
    }


    logger.info("Product Lookup Tool Response ",{
      message: `I found ${mapped.length} products matching your criteria.`,
      products: mapped,
    });

    return {
      message: `I found ${mapped.length} products matching your criteria.`,
      products: mapped,
    };
  },
  {
    name: "product_lookup",
    description:
      "Search products using semantic vector search or filtered/sorted MongoDB queries.",
    schema: {
      type: "object",
      properties: {
        query: { type: "string" },
        n: { type: "number", default: 5 },
        min_price: { type: "number" },
        max_price: { type: "number" },
        category: {
          anyOf: [
            { type: "string", enum: ["Men", "Women", "Kids"] },
            {
              type: "array",
              items: { type: "string", enum: ["Men", "Women", "Kids"] },
            },
          ],
        },
        subCategory: {
          anyOf: [
            { type: "string", enum: ["Topwear", "Bottomwear", "Winterwear"] },
            {
              type: "array",
              items: { type: "string", enum: ["Topwear", "Bottomwear", "Winterwear"] },
            },
          ],
        },
        sort_by: {
          type: "string",
          enum: ["price_asc", "price_desc", "newest", "rating_asc", "rating_desc"],
        },
      },
      required: ["query"],
    },
  }
);
