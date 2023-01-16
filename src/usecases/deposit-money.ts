import { Deposit } from "../domain/entities/deposit";
import { NotFound } from "../utils/http/not-found";
import { TransactionsRepository } from "../ports/repositories/transactions";
import { UsersRepository } from "../ports/repositories/users";

interface Dependencies {
  usersRepository: UsersRepository;
  transactionsRepository: TransactionsRepository;
}

interface Input {
  payeeId: string;
  value: number;
}

export class DepositMoney {
  private readonly usersRepository: UsersRepository;
  private readonly transactionsRepository: TransactionsRepository;

  constructor(input: Dependencies) {
    Object.assign(this, input);
  }

  async execute(input: Input): Promise<{ transactionId: string }> {
    const user = await this.usersRepository.findById(input.payeeId);
    if (!user) throw new NotFound("User not found");
    const deposit = Deposit.create(input);
    await this.transactionsRepository.create(deposit);
    return { transactionId: deposit.id };
  }
}
