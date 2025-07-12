import {
  getUsersMiddleware,
  getUserMiddleware,
  createUserMiddleware,
  updateUserMiddleware,
  deleteUserMiddleware,
  createMultipleUserMiddleware,
} from "../middleware/user.middleware.js";

export default async function handler(req, res) {
  const { method, url } = req;

  // /api/users (GET, POST)
  if (url === "/api/users" && method === "GET") {
    await new Promise((resolve) => {
      getUsersMiddleware(req, res, (err) => {
        if (err) {
          res.status(500).json({ error: err.error || "Internal Server Error" });
          resolve();
        } else {
          res.status(200).json(req.locals);
          resolve();
        }
      });
    });
    return;
  }
  if (url === "/api/users" && method === "POST") {
    await new Promise((resolve) => {
      createUserMiddleware(req, res, (err) => {
        if (err) {
          res.status(500).json({ error: err.error || "Internal Server Error" });
          resolve();
        } else {
          res.status(200).json(req.locals);
          resolve();
        }
      });
    });
    return;
  }
  // /api/users/multiple (POST)
  if (url === "/api/users/multiple" && method === "POST") {
    await new Promise((resolve) => {
      createMultipleUserMiddleware(req, res, (err) => {
        if (err) {
          res.status(500).json({ error: err.error || "Internal Server Error" });
          resolve();
        } else {
          res.status(200).json(req.locals);
          resolve();
        }
      });
    });
    return;
  }
  // /api/user/:id (GET, PUT, DELETE)
  const userIdMatch = url.match(/^\/api\/user\/(\d+)$/);
  if (userIdMatch) {
    const id = userIdMatch[1];
    req.params = { id };
    if (method === "GET") {
      await new Promise((resolve) => {
        getUserMiddleware(req, res, (err) => {
          if (err) {
            res.status(404).json({ error: err.error || "Not Found" });
            resolve();
          } else {
            res.status(200).json(req.locals);
            resolve();
          }
        });
      });
      return;
    }
    if (method === "PUT") {
      await new Promise((resolve) => {
        updateUserMiddleware(req, res, (err) => {
          if (err) {
            res
              .status(500)
              .json({ error: err.error || "Internal Server Error" });
            resolve();
          } else {
            res.status(200).json(req.locals);
            resolve();
          }
        });
      });
      return;
    }
    if (method === "DELETE") {
      await new Promise((resolve) => {
        deleteUserMiddleware(req, res, (err) => {
          if (err) {
            res
              .status(500)
              .json({ error: err.error || "Internal Server Error" });
            resolve();
          } else {
            res.status(200).json({ message: "User Deleted" });
            resolve();
          }
        });
      });
      return;
    }
  }
  res.status(404).json({ error: "Not Found" });
}
