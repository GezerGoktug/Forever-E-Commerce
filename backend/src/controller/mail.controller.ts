import path from "path";
import fs from "fs";
import ejs from "ejs";
import juice from "juice";
import nodemailer from "nodemailer";
import logger from "../config/logger";
import { ErrorHandler } from "../error/errorHandler";

export const sendOrderMail = async (
  order: any,
  toEmail: string,
  payment: boolean
) => {
  try {
    const { delivery_info, products, totalPrice } = order;

    const publicMailPath = path.resolve(process.cwd(), "public", "mail");

    const templatePath = path.join(
      publicMailPath,
      "payment",
      "template.ejs"
    );

    const ejsTemplate = fs.readFileSync(templatePath, "utf8");

    const renderedHtml = ejs.render(ejsTemplate, {
      name: delivery_info.firstName + " " + delivery_info.lastName,
      products: products,
      totalPrice: totalPrice,
      deliveryInfos: delivery_info,
      payment,
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Forever E-commerce" <${process.env.EMAIL}>`,
      to: toEmail,
      subject: "Payment Successfully",
      html: renderedHtml,
      attachments: [
        {
          filename: "logo.png",
          path: path.join(publicMailPath, "payment", "png", "logo.png"),
          cid: "logo",
        },
        {
          filename: "success-icon.png",
          path: path.join(publicMailPath, "payment", "png", "success-icon.png"),
          cid: "success-icon",
        },
        {
          filename: "delivery-icon.png",
          path: path.join(publicMailPath, "payment", "png", "delivery-icon.png"),
          cid: "delivery-icon",
        },
        {
          filename: "instagram-icon.png",
          path: path.join(publicMailPath, "payment", "png", "instagram-icon.png"),
          cid: "instagram-icon",
        },
        {
          filename: "shopping-bag-icon.png",
          path: path.join(publicMailPath, "payment", "png", "shopping-bag-icon.png"),
          cid: "shopping-bag-icon",
        },
        {
          filename: "x-icon.png",
          path: path.join(publicMailPath, "payment", "png", "x-icon.png"),
          cid: "x-icon",
        },
      ],
    });

    logger.info("Order email sent successfully", {
      email: toEmail,
      orderId: order._id,
      paymentStatus: payment,
    });
  } catch (err) {
    throw new ErrorHandler(500, 'Failed to send order email');
  }
};

export const sendResetPasswordCodeEmail = async (
  toEmail: string,
  resetCode: string
) => {
  try {
    const publicMailPath = path.resolve(process.cwd(), "public", "mail");

    const ejsPath = path.join(
      publicMailPath,
      "reset-password",
      "template.ejs"
    );

    const cssPath = path.join(
      publicMailPath,
      "reset-password",
      "style.css"
    );

    const ejsTemplate = fs.readFileSync(ejsPath, "utf8");
    const css = fs.readFileSync(cssPath, "utf8");

    const ejsHtmlContent = ejs.render(ejsTemplate, { resetCode });
    const html = juice.inlineContent(ejsHtmlContent, css);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Forever E-commerce" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Reset Password",
      html,
      attachments: [
        {
          filename: "logo.png",
          path: path.join(publicMailPath, "reset-password", "png", "logo.png"),
          cid: "logo",
        },
      ],
    });

    logger.info("Reset password email sent successfully", {
      email: toEmail,
      resetCode,
    });
  } catch (err) {
    logger.error("Reset password email ", err)
    throw new ErrorHandler(500, 'Failed to send reset password email');
  }
};
