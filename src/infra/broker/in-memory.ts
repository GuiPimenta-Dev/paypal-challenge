import { Broker } from "../../application/ports/broker/broker";
import { DomainEvent } from "../../domain/events/implements/domain-event";
import { Handler } from "../../application/handlers/implements/handler";

export class InMemoryBroker implements Broker {
  handlers: Handler[];

  constructor() {
    this.handlers = [];
  }

  register(handler: Handler) {
    this.handlers.push(handler);
  }

  publish(action: DomainEvent): void {
    this.handlers.forEach(async (handler) => {
      if (handler.name === action.name) {
        handler.handle(action);
      }
    });
  }
}
