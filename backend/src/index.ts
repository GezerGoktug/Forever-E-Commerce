import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import cors from "./config/cors";
import morgan from "./config/morgan";

import mainRouter from "./routes/index";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.middleware";
import helmet from "helmet";
import swagger from "swagger-ui-express";
import defineClientId from "./util/client-id-generator";
import logger from "./config/logger";

dotenv.config();
connectDB();

require("./config/redis");
require("./config/cloudinary");

const app = express();

app.use(cors);

app.use(helmet());

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(defineClientId);

app.use(morgan);

app.use("/api", mainRouter);

if (process.env.NODE_ENV === "development") {
  const swaggerDocument = require("./swagger.json");
  app.use(
    "/api-docs",
    swagger.serve,
    swagger.setup(swaggerDocument, { explorer: true })
  );
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
