import { BadRequest } from "../../../utils/http/bad-request";
import { Transaction } from "./transaction";

export abstract class RollbackStrategy extends Transaction {
  private wasRollbackDone = false;

  markRollbackAsDone() {
    if (this.wasRollbackDone) throw new BadRequest("This transaction was already undone");
    this.wasRollbackDone = true;
  }

  abstract rollback(): Transaction;
}
