import { Router } from 'express';
import TransactionController  from "../controllers/transaction.controller";
import { authenticate, authorizedUser} from "../utils/auth"
import { Roles } from '../utils/constant';

const TransactionRouter = Router();
const transactionController = new TransactionController()

TransactionRouter.post('/update-stock', authenticate, authorizedUser([Roles.Admin]), transactionController.updateStock);
TransactionRouter.get('/reports/stock', authenticate, authorizedUser([Roles.Admin]), transactionController.generateStockReport);

export default TransactionRouter;