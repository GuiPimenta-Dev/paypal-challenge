import { DomainEvent } from "./implements/domain-event";

interface Input {
  email: string;
  value: number;
}

export class TransferMade implements DomainEvent {
  name = "TransferMade";
  email: string;
  value: number;

  constructor(input: Input) {
    this.email = input.email;
    this.value = input.value;
  }
}
