import { Transaction, TransactionType } from "../domain/entities/transaction";
import { User, UserCategory } from "../domain/entities/user";

import { AuthorizerProvider } from "../ports/providers/authorizer";
import { Broker } from "../ports/broker/broker";
import { TransactionsRepository } from "../ports/repositories/transactions";
import { TransferMade } from "../domain/events/transfer-made";
import { UsersRepository } from "../ports/repositories/users";

interface Dependencies {
  userRepository: UsersRepository;
  transactionsRepository: TransactionsRepository;
  authorizer: AuthorizerProvider;
  broker: Broker;
}

interface Input {
  payerId: string;
  payeeId: string;
  value: number;
}

export class TransferMoney {
  private readonly userRepository: UsersRepository;
  private readonly transactionsRepository: TransactionsRepository;
  private readonly authorizer: AuthorizerProvider;
  private readonly broker: Broker;

  constructor(input: Dependencies) {
    Object.assign(this, input);
  }

  async execute(input: Input): Promise<{ transactionId: string }> {
    await this.validatePayer(input.payerId);
    const payee = await this.validatePayee(input.payeeId);
    await this.verifyIfPayerHasEnoughBalance(input.payerId, input.value);
    await this.verifyIfTransactionIsAuthorized();
    const transaction = await this.makeTransfer(input, payee);
    return { transactionId: transaction.id };
  }

  private async validatePayer(payerId: string): Promise<void> {
    const payer = await this.userRepository.findById(payerId);
    if (!payer) throw new Error("Payer not found");
    if (payer.category === UserCategory.SHOPKEEPER) throw new Error("Shopkeepers cannot transfer money");
  }

  private async validatePayee(payeeId: string): Promise<User> {
    const payee = await this.userRepository.findById(payeeId);
    if (!payee) throw new Error("Payee not found");
    return payee;
  }

  private async verifyIfPayerHasEnoughBalance(payerId: string, value: number): Promise<void> {
    const balance = await this.transactionsRepository.calculateBalance(payerId);
    if (balance < value) throw new Error("Insufficient funds");
  }

  private async verifyIfTransactionIsAuthorized(): Promise<void> {
    const isAuthorized = await this.authorizer.isAuthorized();
    if (!isAuthorized) throw new Error("Transaction not authorized");
  }

  private async makeTransfer(input: Input, payee: User): Promise<Transaction> {
    const transfer = { ...input, type: TransactionType.TRANSFER };
    const transaction = Transaction.create(transfer);
    await this.transactionsRepository.create(transaction);
    await this.broker.publish(new TransferMade({ email: payee.email, value: input.value }));
    return transaction;
  }
}
