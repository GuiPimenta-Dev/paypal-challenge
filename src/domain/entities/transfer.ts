import { NonRollbackableTransaction } from "./extends/non-rollbackable-transaction";
import { RollbackableTransaction } from "./extends/rollbackable-transaction";
import { v4 as uuid } from "uuid";

interface Input {
  payerId: string;
  payeeId: string;
  value: number;
}

class RollbackTransfer extends NonRollbackableTransaction {
  id: string;
  value: number;
  payerId: string;
  payeeId: string;
  sourceId: string;
  type = "rollback-transfer";

  constructor(props: Input & { sourceId: string }) {
    super();
    this.id = uuid();
    Object.assign(this, props);
  }
}

export class Transfer extends RollbackableTransaction {
  id: string;
  value: number;
  payerId: string;
  payeeId: string;
  type = "transfer";

  private constructor(props: Input & { id: string }) {
    super();
    Object.assign(this, props);
  }

  static create(input: Input): Transfer {
    return new Transfer({ id: uuid(), ...input });
  }

  createRollback(): RollbackTransfer {
    this.markRollbackAsDone();
    return new RollbackTransfer({ payerId: this.payeeId, payeeId: this.payerId, value: this.value, sourceId: this.id });
  }
}
