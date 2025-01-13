import { Router } from 'express';
import AuthController  from "../controllers/auth.controller";
const AuthRouter = Router();
const authController = new AuthController()


AuthRouter.post('/register', authController.Register);
AuthRouter.post('/login', authController.Login)
AuthRouter.post("/resendotp", authController.resendotp);
AuthRouter.post('/forgotPassword/token', authController.forgotPassword)
AuthRouter.patch("/reset-password/:resetToken", authController.resetPassword);

export default AuthRouter;