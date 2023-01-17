import { RollbackableTransaction, Transaction } from "./extends/transactions";

import { v4 as uuid } from "uuid";

interface Input {
  payerId: string;
  payeeId: string;
  value: number;
}

class RollbackTransfer extends Transaction {
  id: string;
  value: number;
  payerId: string;
  payeeId: string;
  type = "rollback-transfer";

  constructor(props: Input) {
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

  rollback() {
    return new RollbackTransfer({ payerId: this.payeeId, payeeId: this.payerId, value: this.value });
  }
}
