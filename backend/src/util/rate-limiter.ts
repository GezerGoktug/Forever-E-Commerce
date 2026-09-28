import { Request, Response } from "express";
import ResponseHandler from "./response";
import { createError } from "./createError";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../config/redis";

const createRedisStore = (prefix: string) => {
  return new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    prefix: `rl-${prefix}:`,
  });
};

const rateLimiterOptionsHandle = (
  prefix: string,
  maxRequest: number,
  delayTime: number,
  customErrorMessage?: string
) => {
  return {
    windowMs: delayTime,
    max: maxRequest,
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore(prefix),
    handler: (req: Request, res: Response) => {
      ResponseHandler.error(
        res,
        429,
        createError<string>(
          req,
          customErrorMessage || "Too many requests from this IP, please try again later."
        )
      );
    },
  };
};

const rateLimiter = (
  prefix: string,
  maxRequest: number = 100,
  delayTime: number = 1000 * 60 * 1, // Default 1 minutes
  customErrorMessage?: string
) => rateLimit(rateLimiterOptionsHandle(prefix, maxRequest, delayTime, customErrorMessage));

export default rateLimiter;

