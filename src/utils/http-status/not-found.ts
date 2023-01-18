import { HttpError } from "./extends/http-error";

export class NotFound extends HttpError {
  constructor(readonly message: any) {
    super(404, message);
  }
}
