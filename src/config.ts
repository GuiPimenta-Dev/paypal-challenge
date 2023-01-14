import { AxiosAdapter } from "./infra/http/axios-adapter";
import { InMemoryBroker } from "./infra/broker/in-memory";
import { InMemoryTransactionsRepository } from "./infra/repositories/in-memory/transactions";
import { InMemoryUsersRepository } from "./infra/repositories/in-memory/users";
import { MockLabAdapter } from "./infra/providers/mocklab-adapter";
import { MockyAdapter } from "./infra/providers/mocky-adapter";
import { TransferMadeHandler } from "./application/handlers/transfer-made";

const emailProvider = new MockLabAdapter(new AxiosAdapter());
const handler = new TransferMadeHandler(emailProvider);
const broker = new InMemoryBroker();
broker.register(handler);

export const config = {
  broker,
  transactionsRepository: new InMemoryTransactionsRepository(),
  usersRepository: new InMemoryUsersRepository(),
  authorizer: new MockyAdapter(new AxiosAdapter()),
};
