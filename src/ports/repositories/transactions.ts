import { Transaction } from "../../domain/entities/extends/transactions";

export interface TransactionsRepository {
  create(transaction: Transaction): Promise<void>;
  findById(id: string): Promise<Transaction | undefined>;
  calculateBalance(userId: string): Promise<number>;
}
