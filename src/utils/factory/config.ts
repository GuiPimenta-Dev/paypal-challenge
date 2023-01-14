import { AxiosAdapter } from "../../infra/http/axios-adapter";
import { InMemoryBroker } from "../../infra/broker/in-memory";
import { InMemoryTransactionsRepository } from "../../infra/repositories/in-memory/transactions";
import { InMemoryUsersRepository } from "../../infra/repositories/in-memory/users";
import { MockLabAdapter } from "../../infra/providers/mocklab-adapter";
import { MockyAdapter } from "../../infra/providers/mocky-adapter";
import { TransferMadeHandler } from "../../application/handlers/transfer-made";

export class ConfigFactory {
  httpClient = new AxiosAdapter();
  emailProvider = new MockLabAdapter(this.httpClient);
  broker = new InMemoryBroker();

  create() {
    this.registerHandlers();
    return {
      broker: this.broker,
      transactionsRepository: new InMemoryTransactionsRepository(),
      usersRepository: new InMemoryUsersRepository(),
      authorizer: new MockyAdapter(this.httpClient),
    };
  }

  private registerHandlers() {
    const handlers = [new TransferMadeHandler(this.emailProvider)];
    handlers.forEach((handler) => this.broker.register(handler));
  }
}
