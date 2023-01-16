import { DepositMoney } from "../../usecases/deposit-money";
import { HttpInput } from "../../ports/http/http-client";
import { Success } from "../../utils/http/success";
import { TransferMoney } from "../../usecases/transfer-money";
import { UndoTransaction } from "../../usecases/undo-transaction";
import { config } from "../../config";

export class TransactionController {
  static async transfer(input: HttpInput): Promise<Success> {
    const { body } = input;
    const usecase = new TransferMoney({ ...config });
    const response = await usecase.execute(body);
    return new Success(response);
  }

  static async deposit(input: HttpInput): Promise<Success> {
    const { body } = input;
    const usecase = new DepositMoney({ ...config });
    const response = await usecase.execute(body);
    return new Success(response);
  }

  static async undo(input: HttpInput): Promise<Success> {
    const { path } = input;
    const usecase = new UndoTransaction({ ...config });
    await usecase.execute(path);
    return new Success();
  }
}
