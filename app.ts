import express from "express";
import errorHandlerController from "./src/controllers/errorHandler.controller";
import AppError from "./src/utils/appError";
import bodyParser from "body-parser";

// Register Routes
import UserRouter from "./src/routes/user.route";
import AuthRouter from "./src/routes/auth.route";

// Inventory Routes
import InventoyRouter from "./src/routes/inventory.route";
import TransactionRouter from "./src/routes/transaction.route";

// Payment gateway
import PaymentRouter from "./src/routes/payment.route";


const app = express();

app.use(bodyParser.json());


interface UserBasicInfo {
  firstName: string;
  lastName: string;
  email: string;
  roles:string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: UserBasicInfo | null;
    }
  }
}

// End Point
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/inventory", InventoyRouter);
app.use("/api/v1/transaction", TransactionRouter);
app.use("/api/v1/payment", PaymentRouter);
app.use( PaymentRouter);


app.all("*", (req, res, next) => {
  next(new AppError(`Page ${req.originalUrl} is not found`, 404));
});

app.use(errorHandlerController);

// Export app
export { app };
