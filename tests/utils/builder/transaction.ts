import { Transaction, TransactionType } from "../../../src/domain/entities/transaction";

export class TransactionBuilder {
  type: TransactionType;
  payerId?: string;
  payeeId: string;
  value: number;

  static aDeposit() {
    const deposit = new TransactionBuilder();
    deposit.type = TransactionType.DEPOSIT;
    return deposit;
  }

  static aTransfer() {
    const transfer = new TransactionBuilder();
    transfer.type = TransactionType.TRANSFER;
    return transfer;
  }

  of(value: number) {
    this.value = value;
    return this;
  }

  from(payerId: string) {
    this.payerId = payerId;
    return this;
  }

  to(payeeId: string) {
    this.payeeId = payeeId;
    return this;
  }

  build() {
    return Transaction.create({ type: this.type, payerId: this.payerId, payeeId: this.payeeId, value: this.value });
  }
}
