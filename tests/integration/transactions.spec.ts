import { HttpClientMock } from "../utils/mocks/http-client-mock";
import { InMemoryBroker } from "../../src/infra/broker/in-memory";
import { InMemoryTransactionsRepository } from "../../src/infra/repositories/in-memory/transactions";
import { InMemoryUsersRepository } from "../../src/infra/repositories/in-memory/users";
import { MockLabAdapter } from "../../src/infra/providers/mocklab-adapter";
import { MockyAdapter } from "../../src/infra/providers/mocky-adapter";
import { TransactionBuilder } from "../utils/builder/transaction";
import { TransferMadeHandler } from "../../src/application/handlers/transfer-made";
import { UserBuilder } from "../utils/builder/user";
import { app } from "../../src/router";
import { config } from "../../src/config";
import request from "supertest";

let httpClientMock: HttpClientMock;

beforeEach(async () => {
  httpClientMock = new HttpClientMock();
  const emailProvider = new MockLabAdapter(httpClientMock);
  const handler = new TransferMadeHandler(emailProvider);
  const broker = new InMemoryBroker();
  broker.register(handler);
  config.usersRepository = new InMemoryUsersRepository();
  config.transactionsRepository = new InMemoryTransactionsRepository();
  config.authorizer = new MockyAdapter(httpClientMock);
  config.broker = broker;
});

it("should be able authorize the transaction, make the transfer and send an email", async () => {
  const payer = UserBuilder.aUser().build();
  const payee = UserBuilder.aUser().build();
  await config.usersRepository.create(payer);
  await config.usersRepository.create(payee);
  const deposit = TransactionBuilder.aDeposit().of(10).to(payer.id).build();
  await config.transactionsRepository.create(deposit);

  const sut = await request(app)
    .post("/transactions/transfer")
    .send({ payerId: payer.id, payeeId: payee.id, value: 10 });

  expect(sut.statusCode).toBe(200);
  expect(sut.body).toHaveProperty("transactionId");
  expect(httpClientMock.calledUrls[0]).toBe("https://run.mocky.io/v3/8fafdd68-a090-496f-8c9a-3442cf30dae6");
  expect(httpClientMock.calledUrls[1]).toBe("http://o4d9z.mocklab.io/notify");
});

it("should be able to make a deposit", async () => {
  const payee = UserBuilder.aUser().build();
  await config.usersRepository.create(payee);

  const sut = await request(app).post("/transactions/deposit").send({ payeeId: payee.id, value: 10 });

  expect(sut.statusCode).toBe(200);
  expect(sut.body).toHaveProperty("transactionId");
});

it("Should be able to undo a transaction", async () => {
  const payer = UserBuilder.aUser().build();
  await config.usersRepository.create(payer);
  const deposit = TransactionBuilder.aDeposit().of(10).to(payer.id).build();
  await config.transactionsRepository.create(deposit);

  const sut = await request(app).delete(`/transactions/${deposit.id}`);

  expect(sut.statusCode).toBe(200);
  expect(sut.body).toHaveProperty("transactionId");
});

it("should be able to list all transactions", async () => {
  const user = UserBuilder.aUser().build();
  await config.usersRepository.create(user);
  const deposit = TransactionBuilder.aDeposit().of(100).to(user.id).build();
  const rollback = deposit.rollback();
  await config.transactionsRepository.create(deposit);
  await config.transactionsRepository.create(rollback);

  const sut = await request(app).get(`/transactions/${user.id}`).send({ userId: user.id });

  expect(sut.statusCode).toBe(200);
  expect(sut.body.transactions).toEqual([deposit, rollback]);
  expect(sut.body.balance).toBe(0);
});
