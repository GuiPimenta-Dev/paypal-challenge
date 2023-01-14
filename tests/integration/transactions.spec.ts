import { AuthorizerAdapter } from "../../src/infra/providers/authorizer-adapter";
import AxiosAdapter from "../../src/infra/http/axios-adapter";
import { InMemoryBroker } from "../../src/infra/broker/in-memory";
import { InMemoryTransactionsRepository } from "../../src/infra/repositories/in-memory/transactions";
import { InMemoryUsersRepository } from "../../src/infra/repositories/in-memory/users";
import { TransactionBuilder } from "../utils/builder/transaction";
import { UserBuilder } from "../utils/builder/user";
import app from "../../src/router";
import { config } from "../../src/config";
import request from "supertest";

beforeEach(async () => {
  config.usersRepository = new InMemoryUsersRepository();
  config.transactionsRepository = new InMemoryTransactionsRepository();
  config.authorizer = new AuthorizerAdapter(new AxiosAdapter());
  config.broker = new InMemoryBroker();
});

it("should be able to make a transfer", async () => {
  const payer = UserBuilder.anUser().build();
  const payee = UserBuilder.anUser().withAnotherCPF().withAnotherEmail().build();
  await config.usersRepository.create(payer);
  await config.usersRepository.create(payee);
  const deposit = TransactionBuilder.aDeposit().of(10).to(payer.id).build();
  await config.transactionsRepository.create(deposit);

  const response = await request(app)
    .post("/transactions/transfer")
    .send({ payerId: payer.id, payeeId: payee.id, value: 10 });

  expect(response.statusCode).toBe(200);
});
