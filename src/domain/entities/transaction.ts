import { v4 as uuid } from "uuid";

export enum TransactionType {
  TRANSFER = "transfer",
  DEPOSIT = "deposit",
}

export class Transaction {
  public readonly id: string;
  public readonly payerId?: string;
  public readonly payeeId: string;
  public readonly value: number;
  public readonly type: TransactionType;

  constructor(props: Omit<Transaction, "id">, id?: string) {
    Object.assign(this, props);
    if (!id) {
      this.id = uuid();
    }
  }
}
