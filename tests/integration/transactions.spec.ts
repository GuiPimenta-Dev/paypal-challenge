import { AxiosAdapter } from "../../src/infra/http/axios-adapter";
import { EmailSpy } from "../utils/mocks/email-spy";
import { InMemoryBroker } from "../../src/infra/broker/in-memory";
import { InMemoryTransactionsRepository } from "../../src/infra/repositories/in-memory/transactions";
import { InMemoryUsersRepository } from "../../src/infra/repositories/in-memory/users";
import { MockyAdapter } from "../../src/infra/providers/mocky-adapter";
import { TransactionBuilder } from "../utils/builder/transaction";
import { TransferMadeHandler } from "../../src/application/handlers/transfer-made";
import { UserBuilder } from "../utils/builder/user";
import { app } from "../../src/router";
import { config } from "../../src/config";
import request from "supertest";

let emailSpy: EmailSpy;

beforeEach(async () => {
  emailSpy = new EmailSpy();
  const handler = new TransferMadeHandler(emailSpy);
  const broker = new InMemoryBroker();
  broker.register(handler);
  config.usersRepository = new InMemoryUsersRepository();
  config.transactionsRepository = new InMemoryTransactionsRepository();
  config.authorizer = new MockyAdapter(new AxiosAdapter());
  config.broker = broker;
});

it("should be able to make a transfer and send an email", async () => {
  const payer = UserBuilder.aUser().build();
  const payee = UserBuilder.aUser().build();
  await config.usersRepository.create(payer);
  await config.usersRepository.create(payee);
  const deposit = TransactionBuilder.aDeposit().of(10).to(payer.id).build();
  await config.transactionsRepository.create(deposit);

  const response = await request(app)
    .post("/transactions/transfer")
    .send({ payerId: payer.id, payeeId: payee.id, value: 10 });

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("transactionId");
  expect(emailSpy.wasCalled).toBe(true);
});

it("should be able to make a deposit", async () => {
  const payee = UserBuilder.aUser().build();
  await config.usersRepository.create(payee);

  const response = await request(app).post("/transactions/deposit").send({ payeeId: payee.id, value: 10 });

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("transactionId");
});

it("Should be able to undo a transaction", async () => {
  const payer = UserBuilder.aUser().build();
  await config.usersRepository.create(payer);
  const deposit = TransactionBuilder.aDeposit().of(10).to(payer.id).build();
  await config.transactionsRepository.create(deposit);

  const response = await request(app).delete(`/transactions/${deposit.id}`);

  expect(response.statusCode).toBe(200);
});
