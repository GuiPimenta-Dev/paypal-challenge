import { Transaction, TransactionType } from "../domain/entities/transaction";

import { TransactionsRepository } from "../ports/repositories/transactions";
import { UsersRepository } from "../ports/repositories/users";

interface Dependencies {
  userRepository: UsersRepository;
  transactionsRepository: TransactionsRepository;
}

interface Input {
  userId: string;
  value: number;
}

export class DepositMoney {
  private readonly userRepository: UsersRepository;
  private readonly transactionsRepository: TransactionsRepository;

  constructor(input: Dependencies) {
    this.userRepository = input.userRepository;
    this.transactionsRepository = input.transactionsRepository;
  }

  async execute(input: Input): Promise<{ transactionId: string }> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) throw new Error("User not found");
    const deposit = { payeeId: input.userId, value: input.value, type: TransactionType.DEPOSIT };
    const transaction = Transaction.create(deposit);
    await this.transactionsRepository.create(transaction);
    return { transactionId: transaction.id };
  }
}
