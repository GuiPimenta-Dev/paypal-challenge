import { Transaction } from "./transaction";

export abstract class NonRollbackableTransaction extends Transaction {
  abstract sourceId: string;
}
