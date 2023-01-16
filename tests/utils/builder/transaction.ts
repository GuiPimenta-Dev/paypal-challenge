import { Deposit } from "../../../src/domain/entities/transaction/deposit";
import { Transfer } from "../../../src/domain/entities/transaction/transfer";

export class TransactionBuilder {
  payerId?: string;
  payeeId: string;
  value: number;
  type: string;

  static aDeposit() {
    const deposit = new TransactionBuilder();
    deposit.type = "deposit";
    return deposit;
  }

  static aTransfer() {
    const transfer = new TransactionBuilder();
    transfer.type = "transfer";
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
    if (this.type === "deposit") return Deposit.create({ payeeId: this.payeeId, value: this.value });
    return Transfer.create({ payerId: this.payerId, payeeId: this.payeeId, value: this.value });
  }
}
