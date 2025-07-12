import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authorization } from "../routes/login.routes.js";
import { userRoutes } from "../routes/user.routes.js";
import { json } from "micro";

dotenv.config();

export const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cors());

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

export default app;

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     res.status(405).json({ error: "Method Not Allowed" });
//     return;
//   }

//   req.body = await json(req); // Parse the body

//   await new Promise((resolve) => {
//     loginMiddleware(req, res, (err) => {
//       if (err) {
//         res.status(401).json({ error: err.error || "Unauthorized" });
//         resolve();
//       } else {
//         res.status(200).json(req.locals);
//         resolve();
//       }
//     });
//   });
// }
