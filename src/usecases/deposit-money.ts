import { Transaction, TransactionType } from "../domain/entities/transaction";

import { NotFound } from "../utils/http/NotFound";
import { TransactionsRepository } from "../ports/repositories/transactions";
import { UsersRepository } from "../ports/repositories/users";

interface Dependencies {
  usersRepository: UsersRepository;
  transactionsRepository: TransactionsRepository;
}

interface Input {
  userId: string;
  value: number;
}

export class DepositMoney {
  private readonly usersRepository: UsersRepository;
  private readonly transactionsRepository: TransactionsRepository;

  constructor(input: Dependencies) {
    Object.assign(this, input);
  }

  async execute(input: Input): Promise<{ transactionId: string }> {
    const user = await this.usersRepository.findById(input.userId);
    if (!user) throw new NotFound("User not found");
    const deposit = { payeeId: input.userId, value: input.value, type: TransactionType.DEPOSIT };
    const transaction = Transaction.create(deposit);
    await this.transactionsRepository.create(transaction);
    return { transactionId: transaction.id };
  }
}
