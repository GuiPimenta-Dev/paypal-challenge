import { NonRollbackableTransaction } from "./extends/non-rollbackable-transaction";
import { RollbackableTransaction } from "./extends/rollbackable-transaction";
import { v4 as uuid } from "uuid";

interface Input {
  payeeId: string;
  value: number;
}

class RollbackDeposit extends NonRollbackableTransaction {
  id: string;
  value: number;
  payeeId: string;
  sourceId: string;
  type = "rollback-deposit";

  constructor(props: Input & { sourceId: string }) {
    super();
    this.id = uuid();
    Object.assign(this, props);
  }
}

export class Deposit extends RollbackableTransaction {
  id: string;
  value: number;
  payeeId: string;
  type = "deposit";

  private constructor(props: Input & { id: string }) {
    super();
    Object.assign(this, props);
  }

  static create(input: Input): Deposit {
    return new Deposit({ id: uuid(), ...input });
  }

  createRollback(): RollbackDeposit {
    this.markRollbackAsDone();
    return new RollbackDeposit({ payeeId: this.payeeId, value: -this.value, sourceId: this.id });
  }
}
