import { v4 as uuid } from "uuid";

export enum TransactionType {
  TRANSFER = "transfer",
  DEPOSIT = "deposit",
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
}
