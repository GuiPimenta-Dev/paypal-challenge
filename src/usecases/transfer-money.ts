import { Transaction, TransactionType } from "../domain/entities/transaction";
import { User, UserCategory } from "../domain/entities/user";

import Broker from "../ports/broker/broker";
import { ExternalAuthorizer } from "../ports/providers/external-authorizer";
import { TransactionsRepository } from "../ports/repository/transactions-repository";
import { TransferMade } from "../domain/events/transfer-made";
import { UserRepository } from "../ports/repository/user-repository";

interface Dependencies {
  userRepository: UserRepository;
  transactionsRepository: TransactionsRepository;
  externalAuthorizer: ExternalAuthorizer;
  broker: Broker;
}

interface Input {
  payerId: string;
  payeeId: string;
  value: number;
}

export class TransferMoney {
  private readonly userRepository: UserRepository;
  private readonly transactionsRepository: TransactionsRepository;
  private readonly externalAuthorizer: ExternalAuthorizer;
  private readonly broker: Broker;

  constructor(input: Dependencies) {
    this.userRepository = input.userRepository;
    this.transactionsRepository = input.transactionsRepository;
    this.externalAuthorizer = input.externalAuthorizer;
    this.broker = input.broker;
  }

  async execute(input: Input): Promise<{ transactionId: string }> {
    await this.validatePayer(input.payerId);
    const payee = await this.validatePayee(input.payeeId);
    await this.validateBalance(input.payerId, input.value);
    await this.validateExternalAuthorizer();
    const transfer = { ...input, type: TransactionType.TRANSFER };
    const transaction = Transaction.create(transfer);
    await this.transactionsRepository.create(transaction);
    await this.broker.publish(new TransferMade({ email: payee.email, value: input.value }));
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

  private async validateBalance(payerId: string, value: number): Promise<void> {
    const balance = await this.transactionsRepository.calculateBalance(payerId);
    if (balance < value) throw new Error("Insufficient funds");
  }

  private async validateExternalAuthorizer(): Promise<void> {
    const isAuthorized = await this.externalAuthorizer.isAuthorized();
    if (!isAuthorized) throw new Error("Transaction not authorized");
  }
}
