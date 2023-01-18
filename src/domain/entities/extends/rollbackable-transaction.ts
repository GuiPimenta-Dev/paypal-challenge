import { BadRequest } from "../../../utils/http-status/bad-request";
import { NonRollbackableTransaction } from "./non-rollbackable-transaction";
import { Transaction } from "./transaction";

export abstract class RollbackableTransaction extends Transaction {
  private wasRollbackDone = false;

  markRollbackAsDone() {
    if (this.wasRollbackDone) throw new BadRequest("This transaction was already undone");
    this.wasRollbackDone = true;
  }

  abstract createRollback(): NonRollbackableTransaction;
}
