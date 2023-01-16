import { v4 as uuid } from "uuid";

export enum TransactionType {
  TRANSFER = "transfer",
  DEPOSIT = "deposit",
  ROLLBACK = "rollback",
}

interface Input {
  payerId?: string;
  payeeId: string;
  value: number;
  type: TransactionType;
}

export class Transaction {
  public readonly id: string;
  public readonly payerId?: string;
  public readonly payeeId: string;
  public readonly value: number;
  public readonly type: TransactionType;

  constructor(props: Input & { id: string }) {
    Object.assign(this, props);
  }

  static create(input: Input): Transaction {
    return new Transaction({ id: uuid(), ...input });
  }

  static mount(input: Input & { id: string }): Transaction {
    return new Transaction(input);
  }

  rollback(): Transaction {
    const rollbackType = { type: TransactionType.ROLLBACK };
    let rollback;
    if (this.type === TransactionType.TRANSFER) {
      rollback = { ...rollbackType, payerId: this.payeeId, payeeId: this.payerId, value: this.value };
    } else {
      rollback = { ...rollbackType, payeeId: this.payeeId, value: -this.value };
    }
    return Transaction.create(rollback);
  }
}
