import { AuthorizerStub } from "./utils/mocks/authorizer-stub";
import { EmailSpy } from "./utils/mocks/email-spy";
import { InMemoryBroker } from "../src/infra/broker/in-memory";
import { InMemoryTransactionsRepository } from "../src/infra/repositories/in-memory/transactions";
import { InMemoryUsersRepository } from "../src/infra/repositories/in-memory/users";
import { TransactionBuilder } from "./utils/builder/transaction";
import { TransferMadeHandler } from "../src/application/handlers/transfer-made";
import { TransferMoney } from "../src/usecases/transfer-money";
import { UserBuilder } from "./utils/builder/user";

let userRepository: InMemoryUsersRepository;
let transactionsRepository: InMemoryTransactionsRepository;
let authorizer: AuthorizerStub;
let broker: InMemoryBroker;

beforeEach(() => {
  userRepository = new InMemoryUsersRepository();
  transactionsRepository = new InMemoryTransactionsRepository();
  authorizer = new AuthorizerStub();
  broker = new InMemoryBroker();
});

it("should be able to transfer money to another user", async () => {
  const payer = UserBuilder.anUser().build();
  const payee = UserBuilder.anUser().withAnotherCPF().withAnotherEmail().build();
  await userRepository.create(payer);
  await userRepository.create(payee);
  const transaction = TransactionBuilder.aDeposit().of(100).to(payer.id).build();
  await transactionsRepository.create(transaction);

  const sut = new TransferMoney({ userRepository, transactionsRepository, authorizer, broker });
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

  const sut = new TransferMoney({ userRepository, transactionsRepository, authorizer, broker });
  const input = { value: 40, payerId: payer.id, payeeId: payee.id };
  await expect(sut.execute(input)).rejects.toThrow("Insufficient funds");
});

it("should not be able to transfer money if you are a shopkeeper", async () => {
  const payer = UserBuilder.aShopkeeper().build();
  const payee = UserBuilder.anUser().build();
  await userRepository.create(payer);
  await userRepository.create(payee);
  const transaction = TransactionBuilder.aDeposit().of(100).to(payer.id).build();
  await transactionsRepository.create(transaction);

  const sut = new TransferMoney({ userRepository, transactionsRepository, authorizer, broker });
  const input = { value: 40, payerId: payer.id, payeeId: payee.id };
  await expect(sut.execute(input)).rejects.toThrow("Shopkeepers cannot transfer money");
});

it("should not make the transfer if the external authorizer does not allow it", async () => {
  const payer = UserBuilder.anUser().build();
  const payee = UserBuilder.anUser().withAnotherCPF().withAnotherEmail().build();
  await userRepository.create(payer);
  await userRepository.create(payee);
  const transaction = TransactionBuilder.aDeposit().of(100).to(payer.id).build();
  await transactionsRepository.create(transaction);
  authorizer.mockResponse(false);

  const sut = new TransferMoney({ userRepository, transactionsRepository, authorizer, broker });
  const input = { value: 40, payerId: payer.id, payeeId: payee.id };
  await expect(sut.execute(input)).rejects.toThrow("Transaction not authorized");
});

it("should send an email to the payee when the transfer is made", async () => {
  const payer = UserBuilder.anUser().build();
  const payee = UserBuilder.anUser().withAnotherCPF().withAnotherEmail().build();
  await userRepository.create(payer);
  await userRepository.create(payee);
  const transaction = TransactionBuilder.aDeposit().of(100).to(payer.id).build();
  await transactionsRepository.create(transaction);
  const emailSpy = new EmailSpy();
  const transferMadeHandler = new TransferMadeHandler(emailSpy);
  broker.register(transferMadeHandler);

  const sut = new TransferMoney({ userRepository, transactionsRepository, authorizer, broker });
  const input = { value: 40, payerId: payer.id, payeeId: payee.id };
  await sut.execute(input);

  expect(emailSpy.to).toBe(payee.email);
  expect(emailSpy.subject).toBe("Transfer Made");
  expect(emailSpy.body).toBe("You received a transfer of 40");
});
