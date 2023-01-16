import { NotFound } from "../utils/http/not-found";
import { TransactionsRepository } from "../ports/repositories/transactions";

interface Dependencies {
  transactionsRepository: TransactionsRepository;
}

export class UndoTransaction {
  private transactionsRepository: TransactionsRepository;

  constructor(input: Dependencies) {
    Object.assign(this, input);
  }

  async execute(input: { transactionId: string }) {
    const { transactionId } = input;
    const transaction = await this.transactionsRepository.findById(transactionId);
    if (!transaction) throw new NotFound("Transaction not found");
    const rollback = transaction.rollback();
    await this.transactionsRepository.create(rollback);
  }
}
