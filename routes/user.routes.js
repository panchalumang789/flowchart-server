import express from "express";
import {
  getUsersMiddleware,
  getUserMiddleware,
  createUserMiddleware,
  updateUserMiddleware,
  deleteUserMiddleware,
  createMultipleUserMiddleware,
} from "../middleware/user.middleware.js";
const router = express.Router();

const userRoutes = router;

userRoutes.get("/api/users", getUsersMiddleware, async (req, res) => {
  res.status(200).json(req.locals);
});

userRoutes.get("/api/user/:id", getUserMiddleware, async (req, res) => {
  res.status(200).json(req.locals);
});

userRoutes.post(
  "/api/users/multiple",
  createMultipleUserMiddleware,
  async (req, res) => {
    res.status(200).json(req.locals);
  }
);

userRoutes.post("/api/users", createUserMiddleware, async (req, res) => {
  res.status(200).json(req.locals);
});

userRoutes.put("/api/users/:id", updateUserMiddleware, async (req, res) => {
  res.status(200).json(req.locals);
});

userRoutes.delete("/api/users/:id", deleteUserMiddleware, async (req, res) => {
  res.status(200).json({ message: "User Deleted" });
});

export { userRoutes };
