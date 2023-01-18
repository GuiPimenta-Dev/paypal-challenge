import { HttpError } from "./extends/http-error";

export class BadRequest extends HttpError {
  constructor(readonly message: any) {
    super(400, message);
  }
}
