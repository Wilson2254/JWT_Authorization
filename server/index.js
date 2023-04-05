import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import router from "./router/index.js";
import errorMiddleware from "./middlewares/error-middleware.js";

const APP_PORT = process.env.PORT;
const app = express();

console.log(typeof process.env.CLIENT_URL);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
  })
);
app.use("/api", router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(APP_PORT, () => {
      console.log(`Server start, PORT: ${APP_PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
