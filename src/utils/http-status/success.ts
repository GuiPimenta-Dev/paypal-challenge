import { HttpSuccess } from "./extends/http-success";

export class Success extends HttpSuccess {
  constructor(readonly data?: any) {
    super(200, data);
  }
}
