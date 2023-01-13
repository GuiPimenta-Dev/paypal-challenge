import { Transaction, TransactionType } from "../../../src/domain/entities/transaction";

export class TransactionBuilder {
  type: TransactionType;
  payeeId: string;

  static aDeposit() {
    const deposit = new TransactionBuilder();
    deposit.type = TransactionType.DEPOSIT;
    return deposit;
  }

  to(payeeId: string) {
    this.payeeId = payeeId;
    return this;
  }

  build() {
    return Transaction.create({ type: this.type, payeeId: this.payeeId, value: 100 });
  }
}
