import { HttpError } from "./extends/HttpError";

export class BadRequest extends HttpError {
  constructor(readonly message: string) {
    super(400, message);
  }
}
