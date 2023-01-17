import { BadRequest } from "../utils/http/bad-request";
import { NotFound } from "../utils/http/not-found";
import { RollbackableTransaction } from "../domain/entities/extends/transactions";
import { TransactionsRepository } from "../ports/repositories/transactions";

interface Dependencies {
  transactionsRepository: TransactionsRepository;
}

export class UndoTransaction {
  private readonly transactionsRepository: TransactionsRepository;

  constructor(input: Dependencies) {
    Object.assign(this, input);
  }

  async execute(input: { transactionId: string }): Promise<{ transactionId: string }> {
    const { transactionId } = input;
    const transaction = await this.transactionsRepository.findById(transactionId);
    if (!transaction) throw new NotFound("Transaction not found");
    if (!(transaction instanceof RollbackableTransaction)) throw new BadRequest("Transaction cannot be undone");
    const rollback = transaction.rollback();
    await this.transactionsRepository.create(rollback);
    return { transactionId: rollback.id };
  }
}
