import { RollbackableTransaction, Transaction } from "./extends/transactions";

import { v4 as uuid } from "uuid";

interface Input {
  payeeId: string;
  value: number;
}

class RollbackDeposit extends Transaction {
  id: string;
  value: number;
  payeeId: string;
  type = "rollback-deposit";

  constructor(props: Input) {
    super();
    Object.assign(this, props);
    this.id = uuid();
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

  rollback() {
    return new RollbackDeposit({ payeeId: this.payeeId, value: -this.value });
  }
}
