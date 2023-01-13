import { EmailSpy } from "./utils/mocks/email-spy";
import { ExternalAuthorizerStub } from "./utils/mocks/authorizer-stub";
import { InMemoryBroker } from "../src/infra/broker/in-memory-broker";
import { InMemoryTransactionsRepository } from "../src/infra/repository/in-memory/transaction-repository";
import { InMemoryUserRepository } from "../src/infra/repository/in-memory/user-repository";
import { TransactionBuilder } from "./utils/builder/transaction-builder";
import { TransferMadeHandler } from "../src/application/handlers/transfer-made-handler";
import { TransferMoney } from "../src/usecases/transfer-money";
import { UserBuilder } from "./utils/builder/user-builder";

let userRepository: InMemoryUserRepository;
let transactionsRepository: InMemoryTransactionsRepository;
let externalAuthorizer: ExternalAuthorizerStub;
let broker: InMemoryBroker;

beforeEach(() => {
  userRepository = new InMemoryUserRepository();
  transactionsRepository = new InMemoryTransactionsRepository();
  externalAuthorizer = new ExternalAuthorizerStub();
  broker = new InMemoryBroker();
});

it("should be able to transfer money to another user", async () => {
  const payer = UserBuilder.anUser().build();
  const payee = UserBuilder.anUser().withAnotherCPF().withAnotherEmail().build();
  await userRepository.create(payer);
  await userRepository.create(payee);
  const transaction = TransactionBuilder.aDeposit().to(payer.id).build();
  await transactionsRepository.create(transaction);

  const sut = new TransferMoney({ userRepository, transactionsRepository, externalAuthorizer, broker });
  const input = { value: 40, payerId: payer.id, payeeId: payee.id };
  await sut.execute(input);

  const payerBalance = await transactionsRepository.calculateBalance(payer.id);
  const payeeBalance = await transactionsRepository.calculateBalance(payee.id);
  expect(payerBalance).toBe(60);
  expect(payeeBalance).toBe(40);
});

it("should not be able to transfer money to another user if payer does not have enough balance", async () => {
  const payer = UserBuilder.anUser().build();
  const payee = UserBuilder.anUser().withAnotherCPF().withAnotherEmail().build();
  await userRepository.create(payer);
  await userRepository.create(payee);
  const transaction = TransactionBuilder.aDeposit().to(payer.id).build();
  await transactionsRepository.create(transaction);

  const sut = new TransferMoney({ userRepository, transactionsRepository, externalAuthorizer, broker });
  const input = { value: 140, payerId: payer.id, payeeId: payee.id };
  await expect(sut.execute(input)).rejects.toThrow("Insufficient funds");
});

it("should not be able to transfer money if you are a shopkeeper", async () => {
  const payer = UserBuilder.aShopkeeper().build();
  const payee = UserBuilder.anUser().build();
  await userRepository.create(payer);
  await userRepository.create(payee);
  const transaction = TransactionBuilder.aDeposit().to(payer.id).build();
  await transactionsRepository.create(transaction);

  const sut = new TransferMoney({ userRepository, transactionsRepository, externalAuthorizer, broker });
  const input = { value: 40, payerId: payer.id, payeeId: payee.id };
  await expect(sut.execute(input)).rejects.toThrow("Shopkeepers cannot transfer money");
});

it("should make the transfer only if the external authorizer allows it", async () => {
  const payer = UserBuilder.anUser().build();
  const payee = UserBuilder.anUser().withAnotherCPF().withAnotherEmail().build();
  await userRepository.create(payer);
  await userRepository.create(payee);
  const transaction = TransactionBuilder.aDeposit().to(payer.id).build();
  await transactionsRepository.create(transaction);
  externalAuthorizer.mockResponse(true);

  const sut = new TransferMoney({ userRepository, transactionsRepository, externalAuthorizer, broker });
  const input = { value: 40, payerId: payer.id, payeeId: payee.id };
  await sut.execute(input);

  const payerBalance = await transactionsRepository.calculateBalance(payer.id);
  const payeeBalance = await transactionsRepository.calculateBalance(payee.id);
  expect(payerBalance).toBe(60);
  expect(payeeBalance).toBe(40);
});

it("should not make the transfer if the external authorizer does not allow it", async () => {
  const payer = UserBuilder.anUser().build();
  const payee = UserBuilder.anUser().withAnotherCPF().withAnotherEmail().build();
  await userRepository.create(payer);
  await userRepository.create(payee);
  const transaction = TransactionBuilder.aDeposit().to(payer.id).build();
  await transactionsRepository.create(transaction);
  externalAuthorizer.mockResponse(false);

  const sut = new TransferMoney({ userRepository, transactionsRepository, externalAuthorizer, broker });
  const input = { value: 40, payerId: payer.id, payeeId: payee.id };
  await expect(sut.execute(input)).rejects.toThrow("Transaction not authorized");
});

it("should send an email to the payee when the transfer is made", async () => {
  const payer = UserBuilder.anUser().build();
  const payee = UserBuilder.anUser().withAnotherCPF().withAnotherEmail().build();
  await userRepository.create(payer);
  await userRepository.create(payee);
  const transaction = TransactionBuilder.aDeposit().to(payer.id).build();
  await transactionsRepository.create(transaction);
  const emailSpy = new EmailSpy();
  const transferMadeHandler = new TransferMadeHandler(emailSpy);
  broker.register(transferMadeHandler);

  const sut = new TransferMoney({ userRepository, transactionsRepository, externalAuthorizer, broker });
  const input = { value: 40, payerId: payer.id, payeeId: payee.id };
  await sut.execute(input);

  expect(emailSpy.to).toBe(payee.email);
  expect(emailSpy.subject).toBe("Transfer Made");
  expect(emailSpy.body).toBe("You received a transfer of 40");
});
