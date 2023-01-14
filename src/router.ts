import { ExpressAdapter } from "./infra/http/express-adapter";
import { TransactionsController } from "./application/controllers/transactions";

const app = ExpressAdapter.create();

app.post("/transactions/transfer", ExpressAdapter.route(TransactionsController.transfer));

export default app;
