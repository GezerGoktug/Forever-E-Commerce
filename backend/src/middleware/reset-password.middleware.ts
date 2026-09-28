import { NextFunction, Request, Response } from "express";
import RedisClient from "../util/redis-client";
import { ErrorHandler } from "../error/errorHandler";
import { hashToken } from "../util/hash";

export const protectResetPasswordRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.substring(7);

  const resetPasswordEmail = req.body.resetPasswordEmail;

  if (
    resetPasswordEmail.trim().length === 0 ||
    !resetPasswordEmail.match(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    )
  ) {
    throw new ErrorHandler(
      400,
      "Reset password email is empty string or invalid format"
    );
  }

  const val = await RedisClient.get(`reset-password-uid:${resetPasswordEmail}`);

  const hashedToken = hashToken(token || "");

  if (val !== hashedToken) throw new ErrorHandler(401, "Unauthorized");

  next();
};
