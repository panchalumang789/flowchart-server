import cors from "cors";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

import { authorization } from "../routes/login.routes.js";
import { userRoutes } from "../routes/user.routes.js";

const app = express();
app.disable("x-powered-by");
app.use(express.json());
// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type"],
//   })
// );
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// Routes
app.use(authorization, userRoutes);

// Error Handling
app.use((error, req, res, next) => {
  console.error("error =>", error);
  res
    .status(error.status || 500)
    .send({ message: error.error || "Internal Error" });
});

// Running server
app.listen(process.env.PORT || 3333, () => {
  console.log(`Running on port ${process.env.PORT}`);
});
