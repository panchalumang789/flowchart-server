import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import { authorization } from "./routes/login.routes.js";
import { userRoutes } from "./routes/user.routes.js";

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(cors({ origin: process.env.CORS_URL, credentials: true }));

app.use(authorization, userRoutes);

app.use((error, req, res, next) => {
  console.log("error==>", error);
  res.status(error.status || 500).send({ message: error.error });
});

// Running server
app.listen(process.env.PORT || 3333, () => {
  console.log(`Running on port ${process.env.PORT}`);
});
