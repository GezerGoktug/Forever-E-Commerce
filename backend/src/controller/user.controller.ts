import { Request, Response } from "express";
import { ErrorHandler } from "../error/errorHandler";
import User from "../models/User.schema";
import RedisClient from "../util/redis-client";
import ResponseHandler from "../util/response";
import bcrypt from "bcryptjs";
import generateUUIDv4 from "../util/uuid";
import { resetPasswordsSchema } from "../validations/schema";
import { sendResetPasswordCodeEmail } from "./mail.controller";
import { hashToken } from "../util/hash";

export const sendResetPasswordRequest = async (req: Request, res: Response) => {
  const resetPasswordEmail = (req.query.resetPasswordEmail as string) || "";

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

  const existUserWithResetEmail = await User.findOne({
    email: resetPasswordEmail,
  });

  if (existUserWithResetEmail) {
    const randomNumber = (Math.random() * 1000000).toFixed(0);
    const resetCode =
      randomNumber.length < 6
        ? Array.from({ length: 6 - randomNumber.length }, () => "0")
          .join("")
          .concat(randomNumber)
        : randomNumber;

    await RedisClient.set(
      `reset-code:${existUserWithResetEmail.email}`,
      JSON.stringify({ resetCode, attempts: 0 }),
      300
    );

    await sendResetPasswordCodeEmail(resetPasswordEmail, resetCode);
  }
  else {
    await new Promise(resolve => setTimeout(resolve, 2500));
  }

  ResponseHandler.success(res, 200, {
    message: "If your email is registered in our system, a reset code has been sent to your address.",
  });
};

export const evalResetPasswordCodeRequest = async (
  req: Request,
  res: Response
) => {
  const resetPasswordCode = (req.query.resetPasswordCode as string) || "";
  const resetPasswordEmail = (req.query.resetPasswordEmail as string) || "";

  if (resetPasswordCode.trim().length === 0) {
    throw new ErrorHandler(400, "Reset password code cannot be empty string ");
  }

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

  const val = await RedisClient.get(`reset-code:${resetPasswordEmail}`);

  if (!val)
    throw new ErrorHandler(
      404,
      "Reset code not found. Please send request with your email for reset code."
    );

  const { resetCode, attempts } = JSON.parse(val);

  if (attempts === 5) {
    await RedisClient.del(`reset-code:${resetPasswordEmail}`);
    throw new ErrorHandler(
      429,
      "You exceed to limits that try reset code.Please again send request with your email for reset code"
    );
  }

  if (resetPasswordCode !== resetCode) {
    await RedisClient.update(
      `reset-code:${resetPasswordEmail}`,
      JSON.stringify({ resetCode, attempts: attempts + 1 }),
    )
    throw new ErrorHandler(400, "Wrong reset password code");
  }

  await RedisClient.del(`reset-code:${resetPasswordEmail}`);

  const uid = generateUUIDv4();

  const hashedToken = hashToken(uid);

  await RedisClient.set(`reset-password-uid:${resetPasswordEmail}`, hashedToken, 600);

  ResponseHandler.success(res, 200, {
    message: "Reset password code is correct",
    token: uid
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { newPassword, resetPasswordEmail } = req.body;

  resetPasswordsSchema.parse({
    password: newPassword,
  });

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.findOneAndUpdate(
    { email: resetPasswordEmail },
    {
      password: hashedPassword,
    }
  );

  await RedisClient.del(`reset-password-uid:${resetPasswordEmail}`)

  ResponseHandler.success(res, 200, {
    message: "Successfully updated your password",
  });
};
