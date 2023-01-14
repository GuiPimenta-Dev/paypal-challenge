import { HttpError } from "./extends/HttpError";

export class NotFound extends HttpError {
  constructor(readonly message: any) {
    super(404, message);
  }
}
