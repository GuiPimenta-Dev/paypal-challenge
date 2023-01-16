import { ExpressAdapter } from "./infra/http/express-adapter";
import { TransactionController } from "./application/controllers/transaction";
import { UserController } from "./application/controllers/user";

const app = ExpressAdapter.create();

app.post("/users", ExpressAdapter.route(UserController.create));
app.post("/transactions/transfer", ExpressAdapter.route(TransactionController.transfer));
app.post("/transactions/deposit", ExpressAdapter.route(TransactionController.deposit));
app.delete("/transactions/:transactionId", ExpressAdapter.route(TransactionController.undo));

export { app };
