import { json } from "micro";
import { loginMiddleware } from "../middleware/login.middleware.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  req.body = await json(req); // Parse the body

  await new Promise((resolve) => {
    loginMiddleware(req, res, (err) => {
      if (err) {
        res.status(401).json({ error: err.error || "Unauthorized" });
        resolve();
      } else {
        res.status(200).json(req.locals);
        resolve();
      }
    });
  });
}
