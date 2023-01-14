import { Broker } from "../../ports/broker/broker";
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

  async publish(action: DomainEvent): Promise<void> {
    this.handlers.forEach(async (handler) => {
      if (handler.name === action.name) {
        await handler.handle(action);
      }
    });
  }
}
