import { DomainEvent } from "../../../domain/events/implements/DomainEvent";
import { Handler } from "../../handlers/implements/Handler";

export default interface Broker {
  handlers: Handler[];
  register(handler: Handler): void;
  publish(action: DomainEvent): Promise<void>;
}
