import { DomainEvent } from "../../../domain/events/implements/domain-event";

export interface Handler {
  name: string;
  handle(event: DomainEvent): void;
}
