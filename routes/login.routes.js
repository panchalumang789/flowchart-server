import express from "express";
import { loginMiddleware } from "../middleware/login.middleware.js";
const router = express.Router();

const authorization = router;

authorization.post(
  "/api/login/authenticate",
  loginMiddleware,
  async (req, res) => {
    res.status(200).json(req.locals);
  }
);

export { authorization }; 
