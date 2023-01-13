import { DomainEvent } from "../../../domain/events/implements/DomainEvent";

export interface Handler {
  name: string;
  handle(event: DomainEvent): void;
}
