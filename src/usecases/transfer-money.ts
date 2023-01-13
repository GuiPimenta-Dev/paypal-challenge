import { Transaction, TransactionType } from "../domain/entities/transaction";

import { ExternalAuthorizer } from "../application/ports/providers/external-authorizer";
import { TransactionsRepository } from "../application/ports/repository/transactions-repository";
import { UserCategory } from "../domain/entities/user";
import { UserRepository } from "../application/ports/repository/user-repository";

interface Dependencies {
  userRepository: UserRepository;
  transactionsRepository: TransactionsRepository;
  externalAuthorizer: ExternalAuthorizer;
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

  constructor(input: Dependencies) {
    this.userRepository = input.userRepository;
    this.transactionsRepository = input.transactionsRepository;
    this.externalAuthorizer = input.externalAuthorizer;
  }

  async execute(input: Input): Promise<{ transactionId: string }> {
    await this.validatePayer(input.payerId);
    await this.validatePayee(input.payeeId);
    await this.validateBalance(input.payerId, input.value);
    await this.validateExternalAuthorizer();
    const transaction = new Transaction({ ...input, type: TransactionType.TRANSFER });
    await this.transactionsRepository.create(transaction);
    return { transactionId: transaction.id };
  }

  private async validatePayer(payerId: string): Promise<void> {
    const payer = await this.userRepository.findById(payerId);
    if (!payer) throw new Error("Payer not found");
    if (payer.category === UserCategory.SHOPKEEPER) throw new Error("Shopkeepers cannot transfer money");
  }

  private async validatePayee(payeeId: string): Promise<void> {
    const payee = await this.userRepository.findById(payeeId);
    if (!payee) throw new Error("Payee not found");
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