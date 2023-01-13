import { DomainEvent } from "./implements/domain-event";

export class TransferMade implements DomainEvent {
  name = "TransferMade";
  email: string;
  value: number;

  constructor(input: { email: string; value: number }) {
    this.email = input.email;
    this.value = input.value;
  }
}
