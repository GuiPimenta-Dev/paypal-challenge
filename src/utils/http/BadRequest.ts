import { HttpError } from "./extends/HttpError";

export class BadRequest extends HttpError {
  constructor(readonly message: any) {
    super(400, message);
  }
}
