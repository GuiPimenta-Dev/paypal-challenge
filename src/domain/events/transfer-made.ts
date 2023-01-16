import { DomainEvent } from "./implements/domain-event";

export class TransferMadeEvent implements DomainEvent {
  name = "TransferMade";
}
