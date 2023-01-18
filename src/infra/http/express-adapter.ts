import { HttpError } from "../../utils/http-status/extends/http-error";
import express from "express";

export class ExpressAdapter {
  static create() {
    const app = express();
    app.use(express.json());
    return app;
  }

  static route(fn) {
    return async function (req, res) {
      try {
        const { query, body, headers, params, file } = req;
        const output = await fn({ query, body, headers, path: params, file });
        res.status(output.statusCode).json(output.data);
      } catch (e) {
        if (e instanceof HttpError) {
          return res.status(e.statusCode).json({ message: e.message });
        }
        res.status(500).json({ message: e.message });
      }
    };
  }
}
