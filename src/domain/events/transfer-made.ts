import { DomainEvent } from "./implements/domain-event";

export class TransferMade implements DomainEvent {
  name = "TransferMade";
}
