import { Transaction, TransactionType } from "../domain/entities/transaction";

import { TransactionsRepository } from "../application/ports/repository/transactions-repository";
import { UserCategory } from "../domain/entities/user";
import { UserRepository } from "../application/ports/repository/user-repository";

interface Input {
  payerId: string;
  payeeId: string;
  value: number;
}

export class TransferMoney {
  constructor(private userRepository: UserRepository, private transactionsRepository: TransactionsRepository) {}

  async execute(input: Input): Promise<{ transactionId: string }> {
    const payer = await this.userRepository.findById(input.payerId);
    const payee = await this.userRepository.findById(input.payeeId);
    if (!payer) throw new Error("Payer not found");
    if (!payee) throw new Error("Payee not found");
    if (payer.category === UserCategory.SHOPKEEPER) throw new Error("Shopkeepers cannot transfer money");
    const payerBalance = await this.transactionsRepository.calculateBalance(payer.id);
    if (payerBalance < input.value) throw new Error("Insufficient funds");
    const transaction = new Transaction({ ...input, type: TransactionType.TRANSFER });
    await this.transactionsRepository.create(transaction);
    return { transactionId: transaction.id };
  }
}
