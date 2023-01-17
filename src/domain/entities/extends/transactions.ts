import { BadRequest } from "../../../utils/http/bad-request";

export class Transaction {
  id: string;
  value: number;
  payerId?: string;
  payeeId: string;
  type: string;
}

export abstract class RollbackableTransaction extends Transaction {
  private wasRollbackDone = false;

  markRollbackAsDone() {
    if (this.wasRollbackDone) throw new BadRequest("Rollback already done");
    this.wasRollbackDone = true;
  }

  abstract rollback(): Transaction;
}
