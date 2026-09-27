import { NextFunction, Request, Response } from "express";
import { Product } from "../models/Product.schema";
import { ExtendedRequest, Files } from "../types/types";
import { JwtPayload } from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import ResponseHandler from "../util/response";
import { ErrorHandler } from "../error/errorHandler";
import { Order } from "../models/Order.schema";
import { productSchema } from "../validations/schema";
import { pageableToResponse, PaginationRequest } from "../util/pagination";
import {
  cacheEvict,
  createCacheKeyWithBrowserId,
  createCacheKeyWithUserId,
  createDynamicVariables,
  setCache,
  updateCache,
} from "../middleware/cache.middleware";
import filterQuery from "../util/query";
import { UserFavouriteProducts } from "../models/user-metada-models/UserFavouriteProduct.schema";
import mongoose from "mongoose";
import logger from "../config/logger";

const generateSortingQuery = (
  field: string,
  sortType: string
): Record<string, number> => {
  switch (sortType) {
    case "asc":
      return { [field]: 1 };
    case "desc":
      return { [field]: -1 };
    case "default":
      return { _id: 1 };
    default:
      return { _id: 1 };
  }
};

const getPublicIdFromUrl = (url: string): string | null => {
  const regex = /\/upload\/(?:v\d+\/)?([^\.]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const addProduct = async (req: Request, res: Response) => {
  const files = req.files as Files;

  const { name, price, description, sizes, category, subCategory } = req.body;

  const mainImg = files?.mainImage && files?.mainImage[0];
  const subImg1 = files?.subImage1 && files?.subImage1[0];
  const subImg2 = files?.subImage2 && files?.subImage2[0];
  const subImg3 = files?.subImage3 && files?.subImage3[0];

  productSchema.parse({
    subCategory,
    category,
    name,
    price: +price,
    description,
    sizes: JSON.parse(sizes),
    mainImage: mainImg,
    subImage1: subImg1,
    subImage2: subImg2,
    subImage3: subImg3,
  });

  if (!mainImg) {
    throw new ErrorHandler(400, "Required main image for product.");
  }

  const images = [mainImg, subImg1, subImg2, subImg3].filter(
    (item) => item !== undefined
  );

  const [mainImage, subImage1, subImage2, subImage3] = await Promise.all(
    images.map(async (img) => {
      const result = await cloudinary.uploader.upload(img?.path, {
        resource_type: "image",
        folder: "mern-e-commerce-products-images",
        unique_filename: true,
      });
      result;
      return result.secure_url || "";
    })
  );

  const newProduct = new Product({
    name,
    price: +price,
    description,
    sizes: JSON.parse(sizes),
    category,
    subCategory,
    image: mainImage,
    subImages: [mainImage, subImage1, subImage2, subImage3].map((img) =>
      img ? img : ""
    ),
  });

  await newProduct.save();

  logger.info(`Product added`, {
    productId: newProduct._id.toString(),
    name: newProduct.name,
    category: newProduct.category,
    subCategory: newProduct.subCategory,
  });

  ResponseHandler.success(res, 200, { message: "Added product successfully" });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id;

  const product = await Product.findById(id);

  const images = product?.subImages === undefined ? [] : product.subImages;

  await Promise.all(
    images.map(async (img) => {
      if (img.trim().length === 0) return;

      await cloudinary.uploader.destroy(getPublicIdFromUrl(img) || "");
    })
  );

  await Product.findByIdAndDelete(id);

  logger.info(`Product deleted`, {
    productId: id,
    name: product?.name,
    category: product?.category,
    subCategory: product?.subCategory,
  });


  ResponseHandler.success(res, 200, { message: "Deleted product succesfully" });
};

export const updateProduct = async (req: Request, res: Response) => {
  const files = req.files as Files;

  const { name, price, description, sizes, category, subCategory } = req.body;

  const id = req.params.id;

  const mainImg = files?.mainImage && files?.mainImage[0];
  const subImg1 = files?.subImage1 && files?.subImage1[0];
  const subImg2 = files?.subImage2 && files?.subImage2[0];
  const subImg3 = files?.subImage3 && files?.subImage3[0];

  productSchema.parse({
    subCategory,
    category,
    name,
    price: +price,
    description,
    sizes: JSON.parse(sizes),
    mainImage: mainImg,
    subImage1: subImg1,
    subImage2: subImg2,
    subImage3: subImg3,
  });

  const product = await Product.findById(id);

  const subImages = product?.subImages === undefined ? [] : product?.subImages;

  const images = [mainImg, subImg1, subImg2, subImg3];

  const [mainImage, subImage1, subImage2, subImage3] = await Promise.all(
    images.map(async (img, i) => {
      if (img !== undefined) {
        if (subImages[i].trim().length === 0) {
          const result = await cloudinary.uploader.upload(img?.path, {
            resource_type: "image",
            folder: "mern-e-commerce-products-images",
            unique_filename: true,
          });
          result;
          return result.secure_url || "";
        }
        const result = await cloudinary.uploader.upload(img?.path, {
          overwrite: true,
          public_id: `${getPublicIdFromUrl(subImages[i])}`,
          invalidate: true,
        });
        result;
        return result.secure_url || "";
      }
      return subImages[i];
    })
  );

  await Product.findByIdAndUpdate(id, {
    name,
    price: +price,
    description,
    sizes: JSON.parse(sizes),
    category,
    subCategory,
    image: mainImage,
    subImages: [mainImage, subImage1, subImage2, subImage3].sort((a, b) =>
      a === "" ? 1 : b === "" ? -1 : 0
    ),
  });

  logger.info(`Product updated`, {
    productId: id,
    oldName: product?.name,
    newName: name,
    category,
    subCategory,
  });


  ResponseHandler.success(res, 200, {
    message: "Updated product successfully",
  });
};

export const getProductsForAdmin = async (req: Request, res: Response) => {
  const pageRequest = PaginationRequest(req, 15);

  const limit = pageRequest.pageSize;
  const skip = pageRequest.pageNumber * limit;

  const products = await Product.find().limit(limit).skip(skip);

  const productsCount = await Product.countDocuments();

  ResponseHandler.success(
    res,
    200,
    pageableToResponse(
      productsCount,
      pageRequest.pageNumber,
      pageRequest.pageSize,
      products
    )
  );
};

export const getProductsByQueries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pageRequest = PaginationRequest(req, 15);

  const { categories, subCategory, searchQuery, minPrice } = filterQuery(
    req,
    ["categories", "subCategory", "searchQuery", "minPrice"],
    {
      categories: "",
      subCategory: "",
      searchQuery: "",
      minPrice: "0",
    }
  );

  const limit = pageRequest.pageSize;
  const skip = pageRequest.pageNumber * limit;

  const filterCategory = Array.isArray(categories)
    ? { category: { $in: categories } }
    : (categories as string).trim().length === 0
      ? {}
      : { category: { $in: categories } };

  const filterSubCategory = Array.isArray(subCategory)
    ? { subCategory: { $in: subCategory } }
    : (subCategory as string).trim().length === 0
      ? {}
      : { subCategory: { $in: subCategory } };

  const filterSearchText =
    (searchQuery as string).trim().length < 3
      ? null
      : { $text: { $search: searchQuery as string } };

  const filterSortingQuery = generateSortingQuery(
    pageRequest.sortField || "_id",
    pageRequest.sortType
  ) as object;

  const filterMinPice = { price: { $gte: +minPrice } };

  const products = await Product.find({
    $and: [filterCategory, filterSubCategory, filterMinPice],
    ...filterSearchText,
  })
    .limit(limit)
    .skip(skip)
    .sort({ ...filterSortingQuery })
    .select("image name price _id");

  const productsCount = await Product.find({
    $and: [filterCategory, filterSubCategory, filterMinPice],
    ...filterSearchText,
  }).countDocuments();

  const maxPricedItem = await Product.find()
    .sort({ price: "desc" })
    .limit(1)
    .select("price");

  await setCache(
    req,
    createCacheKeyWithBrowserId(req, "product-list"),
    pageableToResponse(
      productsCount,
      pageRequest.pageNumber,
      pageRequest.pageSize,
      products,
      {
        maxPrice: maxPricedItem[0].price,
      }
    ),
    createDynamicVariables(
      [],
      [
        "page",
        "pageSize",
        "sortType",
        "sortField",
        "categories",
        "subCategory",
        "searchQuery",
        "minPrice",
      ]
    )
  );

  ResponseHandler.success(
    res,
    200,
    pageableToResponse(
      productsCount,
      pageRequest.pageNumber,
      pageRequest.pageSize,
      products,
      {
        maxPrice: maxPricedItem[0].price,
      }
    )
  );
};

export const getProductDetail = async (req: ExtendedRequest, res: Response) => {
  const productId = req.params.id;

  const product = await Product.findById(productId).populate(
    "comments"
  ).populate(
    "comments.user",
    "name email image",
  );

  if (!product) throw new ErrorHandler(404, "Product not found");

  product.comments.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  const relatedProductsQuery = {
    $or: [
      { category: product?.category },
      { subCategory: product?.subCategory },
    ],
    _id: { $ne: product._id },
  }

  const relatedProductsCount = await Product.find(relatedProductsQuery).countDocuments();

  const randomSkipNumber = Math.floor(Math.random() * ((relatedProductsCount - 5) + 1))

  const relatedProducts = await Product.find(relatedProductsQuery)
    .limit(5)
    .skip(randomSkipNumber)
    .select("image name price _id");

  const totalRating =
    product.comments.length === 0
      ? 0
      : product.comments.reduce((acc, comment) => +comment.rating + acc, 0) /
      product.comments.length;

  await setCache(
    req,
    createCacheKeyWithBrowserId(req, "product-detail"),
    {
      ...product.toObject(),
      reviewsCount: product.comments.length,
      totalRating,
      relatedProducts,
    },
    createDynamicVariables(["id"]),
    300
  );

  ResponseHandler.success(res, 200, {
    ...product.toObject(),
    reviewsCount: product.comments.length,
    totalRating,
    relatedProducts,
  });
};

export const createComment = async (req: ExtendedRequest, res: Response) => {
  const currentUser = req?.user as JwtPayload;
  const { rating, content, productId } = req.body;
  if (content.trim().lenght > 250)
    throw new ErrorHandler(
      400,
      "Comments length aren't more than 250 characters"
    );

  if (!productId) throw new ErrorHandler(400, "Product id not found");

  await Product.findByIdAndUpdate(productId, {
    $push: {
      comments: {
        rating,
        content,
        user: currentUser.userId,
      },
    },
  });

  await cacheEvict(
    req,
    createCacheKeyWithBrowserId(req, "product-detail"),
    createDynamicVariables([], [], [["productId", "id"]])
  );

  logger.info(`Comment created`, {
    userId: currentUser.userId,
    productId,
    rating,
  });

  ResponseHandler.success(res, 200, { message: "Create comment successfully" });
};

export const deleteComment = async (req: ExtendedRequest, res: Response) => {
  const currentUser = req?.user as JwtPayload;
  const commentId = req.params.commentId;
  const productId = req.params.productId;

  const product = await Product.findOne({
    _id: productId,
    "comments._id": commentId,
    "comments.user": currentUser.userId,
  });

  if (!product) {
    throw new ErrorHandler(404, "Comment not found");
  }

  await Product.findByIdAndUpdate(productId, {
    $pull: { comments: { _id: commentId, user: currentUser.userId } },
  });

  await cacheEvict(
    req,
    createCacheKeyWithBrowserId(req, "product-detail"),
    createDynamicVariables([["productId", "id"]])
  );

  logger.info(`Comment deleted`, {
    userId: currentUser.userId,
    productId,
    commentId,
  });

  ResponseHandler.success(res, 200, {
    message: "Deleted comment successfully",
  });
};

export const updateComment = async (req: ExtendedRequest, res: Response) => {
  const currentUser = req?.user as JwtPayload;
  const { rating, content, productId } = req.body;
  const commentId = req.params.id;
  if (content.trim().lenght > 250)
    throw new ErrorHandler(
      400,
      "Comments length aren't more than 250 characters"
    );

  const product = await Product.findOne({
    _id: productId,
    "comments._id": commentId,
    "comments.user": currentUser.userId,
  });

  if (!product) {
    throw new ErrorHandler(404, "Comment not found");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        "comments.$[comment].content": content,
        "comments.$[comment].rating": rating,
      },
    },
    {
      new: true,
      arrayFilters: [
        { "comment._id": commentId, "comment.user": currentUser.userId },
      ],
    }
  ).populate("comments.user", "name email image");

  if (updatedProduct === null)
    throw new ErrorHandler(500, "Product update error");

  const totalRating =
    updatedProduct?.comments.length === 0
      ? 0
      : updatedProduct?.comments.reduce(
        (acc, comment) => +comment?.rating + acc,
        0
      ) / updatedProduct?.comments.length;

  const updatedProductsObject = updatedProduct?.toObject();
  updatedProductsObject.comments.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  await updateCache(
    req,
    createCacheKeyWithBrowserId(req, "product-detail"),
    {
      ...updatedProductsObject,
      totalRating,
    },
    createDynamicVariables([], [], [["productId", "id"]])
  );

  logger.info(`Comment updated`, {
    userId: currentUser.userId,
    productId,
    commentId,
    rating,
  });

  ResponseHandler.success(res, 200, { message: "Update comment successfully" });
};

export const getLatestCollections = async (req: Request, res: Response) => {
  const products = await Product.find().sort({ _id: 1 }).limit(10);

  ResponseHandler.success(res, 200, products);
};

export const getBestSellerProducts = async (req: Request, res: Response) => {
  const bestSellingProducts = await Order.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.product",
        name: { $first: "$products.name" },
        totalQuantitySold: { $sum: "$products.quantity" },
        image: { $first: "$products.image" },
        price: { $first: "$products.price" },
      },
    },
    { $sort: { totalQuantitySold: -1 } },
    { $limit: 5 },
  ]);

  ResponseHandler.success(res, 200, bestSellingProducts);
};

export const getFavProductLength = async (req: ExtendedRequest, res: Response) => {
  const currentUser = req?.user as JwtPayload;
  const userId = new mongoose.Types.ObjectId(currentUser.userId);

  await UserFavouriteProducts.findOneAndUpdate(
    { user: userId },
    { $setOnInsert: { user: userId, products: [] } },
    { upsert: true, new: true }
  );

  const favProductLength = await UserFavouriteProducts.aggregate([
    { $match: { user: userId } },
    { $project: { count: { $size: "$products" } } },
  ]);

  ResponseHandler.success(res, 200, { count: favProductLength[0]?.count || 0 });

}

export const getFavouriteProducts = async (req: ExtendedRequest, res: Response) => {

  const currentUser = req?.user as JwtPayload;

  const paginationRequest = PaginationRequest(req, 10);

  const { sortField, sortType, pageNumber, pageSize } = paginationRequest;

  const { categories, subCategory, searchQuery } = filterQuery(
    req,
    ["categories", "subCategory", "searchQuery"],
    {
      categories: "",
      subCategory: "",
      searchQuery: "",
    }
  );

  const filterCategory = Array.isArray(categories)
    ? { category: { $in: categories } }
    : (categories as string).trim().length === 0
      ? {}
      : { category: { $in: [categories] } };

  const filterSubCategory = Array.isArray(subCategory)
    ? { subCategory: { $in: subCategory } }
    : (subCategory as string).trim().length === 0
      ? {}
      : { subCategory: { $in: [subCategory] } };

  const filterSearchText =
    (searchQuery as string).trim().length < 3
      ? null
      : { $text: { $search: searchQuery as string } };

  const filterSortingQuery = generateSortingQuery(
    sortField || '_id',
    sortType
  ) as object


  const favouriteProducts = await UserFavouriteProducts
    .findOne({ user: currentUser.userId })
    .populate({
      path: 'products',
      match: {
        $and: [filterCategory, filterSubCategory],
        ...filterSearchText,
      },
      options: {
        sort: { ...filterSortingQuery },
        skip: pageSize * pageNumber,
        limit: pageSize
      },
      select: 'image name price _id'
    })
    .select('products')

  const productMatch: any = {
    $expr: { $in: ["$_id", "$$productIds"] },
    ...filterCategory,
    ...filterSubCategory,
    ...filterSearchText
  };

  const favProductLength = await UserFavouriteProducts.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(currentUser.userId) } },
    {
      $lookup: {
        from: "products",
        let: { productIds: "$products" },
        pipeline: [
          { $match: productMatch },
        ],
        as: "productDocs",
      },
    },
    { $project: { count: { $size: "$productDocs" } } },
  ]);

  await setCache(
    req,
    createCacheKeyWithBrowserId(req, createCacheKeyWithUserId(req, 'favProducts')),
    pageableToResponse(favProductLength[0].count, pageNumber, pageSize, favouriteProducts?.products || []),
    createDynamicVariables(
      [],
      [
        "page",
        "pageSize",
        "sortType",
        "sortField",
        "categories",
        "subCategory",
        "searchQuery",
      ]
    ),
    300
  )

  ResponseHandler.success(res, 200, pageableToResponse(favProductLength[0].count, pageNumber, pageSize, favouriteProducts?.products || []));

}

export const addFavouriteProduct = async (req: ExtendedRequest, res: Response) => {

  const currentUser = req?.user as JwtPayload;

  const { productId } = req.body;

  //? addToSet obstruct to duplicate datas
  await UserFavouriteProducts.findOneAndUpdate({
    user: currentUser.userId
  }, {
    $addToSet: {
      products: productId
    }
  },
    { new: true, upsert: true }
  );

  await cacheEvict(req, createCacheKeyWithBrowserId(req, createCacheKeyWithUserId(req, 'favProducts')));


  ResponseHandler.success(res, 200, { message: 'Successfully product added to your favourite products.' });

}

export const removeFavouriteProduct = async (req: ExtendedRequest, res: Response) => {
  const currentUser = req?.user as JwtPayload;

  const productId = req.params.productId || ''

  if (productId.trim().length === 0) {
    throw new ErrorHandler(400, 'Could not be find product your want to delete.');
  }

  await UserFavouriteProducts.findOneAndUpdate({
    user: currentUser.userId
  }, {
    $pull: {
      products: productId
    }
  },
    { new: true, upsert: true }
  );

  await cacheEvict(req, createCacheKeyWithBrowserId(req, createCacheKeyWithUserId(req, 'favProducts')));

  ResponseHandler.success(res, 200, { message: 'Successfully product remove to your favourite products.' });

}

export const getIsProductInFavourites = async (req: ExtendedRequest, res: Response) => {

  const currentUser = req?.user as JwtPayload;

  const { productIds } = req.body;

  const result = await UserFavouriteProducts.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(currentUser.userId) }
    },
    {
      $project: {
        _id: 0,
        result: {
          $map: {
            input: productIds.map((id: string) => (new mongoose.Types.ObjectId(id))),
            as: "pid",
            in: {
              _id: "$$pid",
              isFav: { $in: ["$$pid", "$products"] }
            }
          }
        }
      }
    },
    {
      $unwind: "$result"
    },
    {
      $replaceRoot: { newRoot: "$result" }
    }
  ]);

  ResponseHandler.success(res, 200, result)

}

export const getIsFavouriteByProductId = async (req: ExtendedRequest, res: Response) => {

  const currentUser = req?.user as JwtPayload;

  const productId = req.params.id || '';

  const result = await UserFavouriteProducts.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(currentUser.userId) }
    },
    {
      $project: {
        _id: 0,
        result: {
          $map: {
            input: [new mongoose.Types.ObjectId(productId)],
            as: "pid",
            in: {
              _id: "$$pid",
              isFav: { $in: ["$$pid", "$products"] }
            }
          }
        }
      }
    },
    {
      $unwind: "$result"
    },
    {
      $replaceRoot: { newRoot: "$result" }
    }
  ]);

  ResponseHandler.success(res, 200, result[0]);

}