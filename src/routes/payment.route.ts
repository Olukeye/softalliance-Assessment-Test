import { Router } from 'express';
import PaymentController  from "../controllers/payment.controller";
import { authenticate} from "../utils/auth"
import { verifySignature } from '../middlewares/verifSignature';


const PaymentRouter = Router();
const paymentController = new PaymentController()

PaymentRouter.post('/initialize', authenticate, paymentController.initializePayment);
PaymentRouter.post('/webhook/payments', verifySignature, paymentController.paymentWebhook);

export default PaymentRouter;