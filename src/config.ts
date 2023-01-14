import { InMemoryBroker } from "./infra/broker/in-memory";
import { InMemoryTransactionsRepository } from "./infra/repositories/in-memory/transactions";
import { InMemoryUsersRepository } from "./infra/repositories/in-memory/users";
import { MockyAuthorizer } from "./infra/providers/authorizer";

export const config = {
  broker: new InMemoryBroker(),
  transactionsRepository: new InMemoryTransactionsRepository(),
  usersRepository: new InMemoryUsersRepository(),
  authorizer: new MockyAuthorizer(),
};
