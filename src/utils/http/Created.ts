import { HttpSuccess } from "./extends/HttpSuccess";

export class Created extends HttpSuccess {
  constructor(readonly data?: any) {
    super(201, data);
  }
}
