import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authorization } from "../routes/login.routes.js";
import { userRoutes } from "../routes/user.routes.js";

dotenv.config();

export const prisma = new PrismaClient();

const app = express();
app.use(express.json());

const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsConfig));
app.options("", cors(corsConfig));

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   next();
// });

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
