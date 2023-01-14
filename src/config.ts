import { AuthorizerAdapter } from "./infra/providers/authorizer-adapter";
import AxiosAdapter from "./infra/http/axios-adapter";
import { InMemoryBroker } from "./infra/broker/in-memory";
import { InMemoryTransactionsRepository } from "./infra/repositories/in-memory/transactions";
import { InMemoryUsersRepository } from "./infra/repositories/in-memory/users";

export const config = {
  broker: new InMemoryBroker(),
  transactionsRepository: new InMemoryTransactionsRepository(),
  usersRepository: new InMemoryUsersRepository(),
  authorizer: new AuthorizerAdapter(new AxiosAdapter()),
};
