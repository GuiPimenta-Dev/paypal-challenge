import { AuthorizerProvider } from "../ports/providers/authorizer";
import { BadRequest } from "../utils/http/bad-request";
import { Broker } from "../ports/broker/broker";
import { NotFound } from "../utils/http/not-found";
import { TransactionsRepository } from "../ports/repositories/transactions";
import { Transfer } from "../domain/entities/transfer";
import { TransferMade } from "../domain/events/transfer-made";
import { UserCategory } from "../domain/entities/user";
import { UsersRepository } from "../ports/repositories/users";

interface Dependencies {
  usersRepository: UsersRepository;
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
  private readonly usersRepository: UsersRepository;
  private readonly transactionsRepository: TransactionsRepository;
  private readonly authorizer: AuthorizerProvider;
  private readonly broker: Broker;

  constructor(input: Dependencies) {
    Object.assign(this, input);
  }

  async execute(input: Input): Promise<{ transactionId: string }> {
    await this.validatePayer(input.payerId);
    await this.validatePayee(input.payeeId);
    await this.verifyIfPayerHasEnoughBalance(input.payerId, input.value);
    await this.verifyIfTransactionIsAuthorized();
    const transfer = await this.makeTransfer(input);
    return { transactionId: transfer.id };
  }

  private async validatePayer(payerId: string): Promise<void> {
    const payer = await this.usersRepository.findById(payerId);
    if (!payer) throw new NotFound("Payer not found");
    if (payer.category === UserCategory.SHOPKEEPER) throw new Error("Shopkeepers cannot transfer money");
  }

  private async validatePayee(payeeId: string): Promise<void> {
    const payee = await this.usersRepository.findById(payeeId);
    if (!payee) throw new NotFound("Payee not found");
  }

  private async verifyIfPayerHasEnoughBalance(payerId: string, value: number): Promise<void> {
    const balance = await this.transactionsRepository.calculateBalance(payerId);
    if (balance < value) throw new BadRequest("Insufficient funds");
  }

  private async verifyIfTransactionIsAuthorized(): Promise<void> {
    const isAuthorized = await this.authorizer.isAuthorized();
    if (!isAuthorized) throw new BadRequest("Transaction not authorized");
  }

  private async makeTransfer(input: Input): Promise<Transfer> {
    const transfer = Transfer.create(input);
    await this.transactionsRepository.create(transfer);
    const event = new TransferMade();
    this.broker.publish(event);
    return transfer;
  }
}
