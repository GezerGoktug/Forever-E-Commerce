import express from "express";
import asyncHandler from "express-async-handler";
import rateLimiter from "../util/rate-limiter";
import { protectResetPasswordRequest } from "../middleware/reset-password.middleware";
import {
  evalResetPasswordCodeRequest,
  resetPassword,
  sendResetPasswordRequest,
} from "../controller/user.controller";

const router = express.Router();

router.get(
  "/reset-password-req",
  rateLimiter(
    "reset-password-req",
    1,
    1000 * 60 * 2,
    "You can only request a reset code once every 2 minutes. Please wait before trying again."
  ),
  asyncHandler(sendResetPasswordRequest)
);
router.get(
  "/eval-reset-password-code",
  rateLimiter(
    "reset-password-code",
    8,
    1000 * 60 * 5,
    "Too many verification attempts. Please wait a few minutes before trying again."
  ),
  asyncHandler(evalResetPasswordCodeRequest)
);
router.post(
  "/reset-password",
  rateLimiter(
    "reset-password",
    8,
    1000 * 60 * 5,
    "Too many password reset attempts. Please wait a few minutes before trying again."
  ),
  asyncHandler(protectResetPasswordRequest),
  asyncHandler(resetPassword)
);

export default router;
