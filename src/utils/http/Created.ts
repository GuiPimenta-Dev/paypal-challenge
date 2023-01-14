import { HttpSuccess } from "./extends/HttpSuccess";

export class Created extends HttpSuccess {
  constructor(readonly data?: string) {
    super(201, data);
  }
}
