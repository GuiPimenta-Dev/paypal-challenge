import { HttpError } from "./extends/HttpError";

export class NotFound extends HttpError {
  constructor(readonly message: string) {
    super(404, message);
  }
}
