import { HttpInput } from "../../ports/http/http-client";
import { Success } from "../../utils/http/Success";
import { TransferMoney } from "../../usecases/transfer-money";
import { config } from "../../config";

export class TransactionsController {
  static async transfer(input: HttpInput): Promise<Success> {
    const { body } = input;
    const usecase = new TransferMoney({ ...config });
    await usecase.execute(body);
    return new Success();
  }
}
