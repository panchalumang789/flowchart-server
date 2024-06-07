import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import { authorization } from "./routes/login.routes.js";
import { userRoutes } from "./routes/user.routes.js";

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
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  }),
  function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  }
);

app.use(authorization, userRoutes);

app.use((error, req, res, next) => {
  console.log("error==>", error);
  res.status(error.status || 500).send({ message: error.error });
});

// Running server
app.listen(process.env.PORT || 3333, () => {
  console.log(`Running on port ${process.env.PORT}`);
});
