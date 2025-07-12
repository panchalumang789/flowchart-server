// // api/index.js

// import app from "../lib/index.js";

// export default function handler(req, res) {
//   return app(req, res);
// }

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authorization } from "../routes/login.routes";
import { userRoutes } from "../routes/user.routes";

dotenv.config();

export const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(authorization, userRoutes);

app.use((error, req, res, next) => {
  console.error("Error:", error);
  res
    .status(error.status || 500)
    .json({ message: error.error || "Internal Server Error" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

export default app;
