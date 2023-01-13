import { DepositMoney } from "../src/usecases/deposit-money";
import { TransactionsDependenciesFactory } from "./utils/factory/transactions-dependencies-factory";
import { TransferMoney } from "../src/usecases/transfer-money";

it("should be able to deposit money", async () => {
  const dependencyFactory = new TransactionsDependenciesFactory();
  const userId = dependencyFactory.createUser();

  const sut = new DepositMoney(dependencyFactory.dependencies);
  const input = { value: 100, userId };
  await sut.execute(input);

  const { transactionsRepository } = dependencyFactory.dependencies;
  const balance = await transactionsRepository.calculateBalance(userId);
  expect(balance).toBe(100);
});

it("should be able to transfer money to another user", async () => {
  const dependencyFactory = new TransactionsDependenciesFactory();
  const payerId = dependencyFactory.createUser();
  const payeeId = dependencyFactory.createPayee();
  dependencyFactory.makeDeposit(payerId, 100);

  const sut = new TransferMoney(dependencyFactory.dependencies);
  const input = { value: 40, payerId, payeeId };
  await sut.execute(input);

  const { transactionsRepository } = dependencyFactory.dependencies;
  const payerBalance = await transactionsRepository.calculateBalance(payerId);
  const payeeBalance = await transactionsRepository.calculateBalance(payeeId);
  expect(payerBalance).toBe(60);
  expect(payeeBalance).toBe(40);
});

it("should not be able to transfer money to another user if payer does not have enough balance", async () => {
  const dependencyFactory = new TransactionsDependenciesFactory();
  const payerId = dependencyFactory.createUser();
  const payeeId = dependencyFactory.createPayee();
  dependencyFactory.makeDeposit(payerId, 100);

  const sut = new TransferMoney(dependencyFactory.dependencies);
  const input = { value: 140, payerId, payeeId };
  await expect(sut.execute(input)).rejects.toThrow("Insufficient funds");
});

it("should not be able to transfer money if you are a shopkeeper", async () => {
  const dependencyFactory = new TransactionsDependenciesFactory();
  const payerId = dependencyFactory.createShopkeeper();
  const payeeId = dependencyFactory.createPayee();
  dependencyFactory.makeDeposit(payerId, 100);

  const sut = new TransferMoney(dependencyFactory.dependencies);
  const input = { value: 40, payerId, payeeId };
  await expect(sut.execute(input)).rejects.toThrow("Shopkeepers cannot transfer money");
});

it("should make the transfer only if the external authorizer allows it", async () => {
  const dependencyFactory = new TransactionsDependenciesFactory();
  const payerId = dependencyFactory.createUser();
  const payeeId = dependencyFactory.createPayee();
  dependencyFactory.makeDeposit(payerId, 100);
  dependencyFactory.mockAuthorizerResponse(true);

  const sut = new TransferMoney(dependencyFactory.dependencies);
  const input = { value: 40, payerId, payeeId };
  await sut.execute(input);

  const { transactionsRepository } = dependencyFactory.dependencies;
  const payerBalance = await transactionsRepository.calculateBalance(payerId);
  const payeeBalance = await transactionsRepository.calculateBalance(payeeId);
  expect(payerBalance).toBe(60);
  expect(payeeBalance).toBe(40);
});

it("should not make the transfer if the external authorizer does not allow it", async () => {
  const dependencyFactory = new TransactionsDependenciesFactory();
  const payerId = dependencyFactory.createUser();
  const payeeId = dependencyFactory.createPayee();
  dependencyFactory.makeDeposit(payerId, 100);
  dependencyFactory.mockAuthorizerResponse(false);

  const sut = new TransferMoney(dependencyFactory.dependencies);
  const input = { value: 40, payerId, payeeId };
  await expect(sut.execute(input)).rejects.toThrow("Transaction not authorized");
});
