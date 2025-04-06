// api/index.js

import app from "../lib";

export default function handler(req, res) {
  return app(req, res);
}
