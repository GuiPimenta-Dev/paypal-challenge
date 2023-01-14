import { HttpSuccess } from "./extends/HttpSuccess";

export class Success extends HttpSuccess {
  constructor(readonly data?: any) {
    super(200, data);
  }
}
