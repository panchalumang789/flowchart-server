// api/index.js

import app from "../lib/index.js";

export default function handler(req, res) {
  app(req, res);
}
