import { Transaction, TransactionType } from "../domain/entities/transaction";

import { TransactionsRepository } from "../application/ports/repository/transactions-repository";
import { UserRepository } from "../application/ports/repository/user-repository";

interface Input {
  userId: string;
  value: number;
}

export class DepositMoney {
  constructor(private userRepository: UserRepository, private transactionsRepository: TransactionsRepository) {}

  async execute(input: Input): Promise<{ transactionId: string }> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) throw new Error("User not found");
    const transaction = new Transaction({ payeeId: input.userId, value: input.value, type: TransactionType.DEPOSIT });
    await this.transactionsRepository.create(transaction);
    return { transactionId: transaction.id };
  }
}
