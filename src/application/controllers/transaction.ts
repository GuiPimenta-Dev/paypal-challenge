import { DepositMoney } from "../../usecases/deposit-money";
import { HttpInput } from "../../ports/http/http-client";
import { Success } from "../../utils/http/success";
import { TransferMoney } from "../../usecases/transfer-money";
import { config } from "../../config";

export class TransactionController {
  static async transfer(input: HttpInput): Promise<Success> {
    const { body } = input;
    const usecase = new TransferMoney({ ...config });
    await usecase.execute(body);
    return new Success();
  }

  static async deposit(input: HttpInput): Promise<Success> {
    const { body } = input;
    const usecase = new DepositMoney({ ...config });
    await usecase.execute(body);
    return new Success();
  }
}
