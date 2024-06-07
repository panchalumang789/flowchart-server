import express from "express";
import { postMiddleware } from "../middleware/login.middleware.js";
const router = express.Router();

const authorization = router;

authorization.post(
  "/api/login/authenticate",
  postMiddleware,
  async (req, res) => {
    console.log(req.body);
    res.status(200).json({ ...req.body });
  }
);

export { authorization };
