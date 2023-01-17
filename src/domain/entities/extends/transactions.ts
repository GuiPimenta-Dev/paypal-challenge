export class Transaction {
  id: string;
  value: number;
  payerId?: string;
  payeeId: string;
  type: string;
}

export abstract class RollbackableTransaction extends Transaction {
  private rollbackAlreadyDone = false;

  markRollbackAsDone() {
    this.rollbackAlreadyDone = true;
  }

  isRollbackDone() {
    return this.rollbackAlreadyDone;
  }

  abstract rollback(): Transaction;
}
