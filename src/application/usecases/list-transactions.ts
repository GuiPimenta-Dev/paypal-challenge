import { NotFound } from "../../utils/http-status/not-found";
import { Transaction } from "../../domain/entities/extends/transaction";
import { TransactionsRepository } from "../ports/repositories/transactions";
import { UsersRepository } from "../ports/repositories/users";

interface Dependencies {
  usersRepository: UsersRepository;
  transactionsRepository: TransactionsRepository;
}

export class ListTransactions {
  private readonly usersRepository: UsersRepository;
  private readonly transactionsRepository: TransactionsRepository;

  constructor(input: Dependencies) {
    Object.assign(this, input);
  }

  async execute(input: { userId: string }): Promise<Output> {
    const { userId } = input;
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFound("User not found");
    const transactions = await this.transactionsRepository.listByUserId(userId);
    const balance = await this.transactionsRepository.calculateBalance(userId);
    return { transactions, balance };
  }
}
export interface Output {
  transactions: Transaction[];
  balance: number;
}
