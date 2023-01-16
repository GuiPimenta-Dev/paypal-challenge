export class Transaction {
  id: string;
  value: number;
  payerId?: string;
  payeeId: string;
  type: string;
}

export abstract class RollbackableTransaction extends Transaction {
  abstract rollback(): Transaction;
}
