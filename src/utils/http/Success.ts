import { HttpSuccess } from "./extends/HttpSuccess";

export class Success extends HttpSuccess {
  constructor(readonly data?: string) {
    super(200, data);
  }
}
