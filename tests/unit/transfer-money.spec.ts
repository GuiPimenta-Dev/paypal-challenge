import { AuthorizerStub } from "../utils/mocks/authorizer-stub";
import { InMemoryBroker } from "../../src/infra/broker/in-memory";
import { InMemoryTransactionsRepository } from "../../src/infra/repositories/in-memory/transactions";
import { InMemoryUsersRepository } from "../../src/infra/repositories/in-memory/users";
import { TransactionBuilder } from "../utils/builder/transaction";
import { TransferMoney } from "../../src/usecases/transfer-money";
import { UserBuilder } from "../utils/builder/user";

let usersRepository: InMemoryUsersRepository;
let transactionsRepository: InMemoryTransactionsRepository;
let authorizer: AuthorizerStub;
let broker: InMemoryBroker;

beforeEach(() => {
  usersRepository = new InMemoryUsersRepository();
  transactionsRepository = new InMemoryTransactionsRepository();
  authorizer = new AuthorizerStub();
  broker = new InMemoryBroker();
});

it("should be able to transfer money to another user", async () => {
  const payer = UserBuilder.anUser().build();
  const payee = UserBuilder.anUser().build();
  await usersRepository.create(payer);
  await usersRepository.create(payee);
  const deposit = TransactionBuilder.aDeposit().of(100).to(payer.id).build();
  await transactionsRepository.create(deposit);

  const sut = new TransferMoney({ usersRepository, transactionsRepository, authorizer, broker });
  const input = { value: 40, payerId: payer.id, payeeId: payee.id };
  await sut.execute(input);

  const payerBalance = await transactionsRepository.calculateBalance(payer.id);
  const payeeBalance = await transactionsRepository.calculateBalance(payee.id);
  expect(payerBalance).toBe(60);
  expect(payeeBalance).toBe(40);
});

it("should be able to transfer money to a shopkeeper", async () => {
  const payer = UserBuilder.anUser().build();
  const payee = UserBuilder.aShopkeeper().build();
  await usersRepository.create(payer);
  await usersRepository.create(payee);
  const deposit = TransactionBuilder.aDeposit().of(100).to(payer.id).build();
  await transactionsRepository.create(deposit);

  const sut = new TransferMoney({ usersRepository, transactionsRepository, authorizer, broker });
  const input = { value: 40, payerId: payer.id, payeeId: payee.id };
  await sut.execute(input);

  const payerBalance = await transactionsRepository.calculateBalance(payer.id);
  const payeeBalance = await transactionsRepository.calculateBalance(payee.id);
  expect(payerBalance).toBe(60);
  expect(payeeBalance).toBe(40);
});

it("should not be able to transfer money to another user if payer does not have enough balance", async () => {
  const payer = UserBuilder.anUser().build();
  const payee = UserBuilder.anUser().build();
  await usersRepository.create(payer);
  await usersRepository.create(payee);

  const sut = new TransferMoney({ usersRepository, transactionsRepository, authorizer, broker });
  const input = { value: 40, payerId: payer.id, payeeId: payee.id };
  await expect(sut.execute(input)).rejects.toThrow("Insufficient funds");
});

it("should not be able to transfer money if you are a shopkeeper", async () => {
  const payer = UserBuilder.aShopkeeper().build();
  const payee = UserBuilder.anUser().build();
  await usersRepository.create(payer);
  await usersRepository.create(payee);
  const deposit = TransactionBuilder.aDeposit().of(100).to(payer.id).build();
  await transactionsRepository.create(deposit);

  const sut = new TransferMoney({ usersRepository, transactionsRepository, authorizer, broker });
  const input = { value: 40, payerId: payer.id, payeeId: payee.id };
  await expect(sut.execute(input)).rejects.toThrow("Shopkeepers cannot transfer money");
});

it("should not make the transfer if the external authorizer does not allows it", async () => {
  const payer = UserBuilder.anUser().build();
  const payee = UserBuilder.anUser().build();
  await usersRepository.create(payer);
  await usersRepository.create(payee);
  const deposit = TransactionBuilder.aDeposit().of(100).to(payer.id).build();
  await transactionsRepository.create(deposit);
  authorizer.mockResponse(false);

  const sut = new TransferMoney({ usersRepository, transactionsRepository, authorizer, broker });
  const input = { value: 40, payerId: payer.id, payeeId: payee.id };
  await expect(sut.execute(input)).rejects.toThrow("Transaction not authorized");
});
