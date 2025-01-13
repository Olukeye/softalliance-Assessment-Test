import { Request, Response } from "express";
import {IUser, User} from "../models/user.model";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/auth";
import { sendSuccess } from "../utils/response";
import AppError from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import passLink from "../middlewares/email_handler/resetPassword.template";
import { createTokenUser } from "../utils/createTokenUser";

class AuthController {
  public Register = catchAsync(async (req: Request, res: Response) => {
    let { firstName, email, password, lastName} = req.body;
    email = email?.trim();
    password = password?.trim();

    if (email == "") {
      throw new AppError("Pls Enter Your Email", 401);
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw new AppError("Email is Invalid", 401);
    } else if (password.length < 6) {
      throw new AppError("Password should be at least 6 Characters", 401);
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new AppError("The user already exists", 409);
    }

    const user = new User({
      firstName,
      email,
      lastName,
      password,
    });

    await user.save()

    if (user) {
      return sendSuccess(res, 201, {
        message: "Check your email for a verification otp!",
        user,
      });
    } else {
      throw new AppError("The user already exists", 400);
    }
  });

  public Login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    const user = (await User.findOne({ email })) as IUser; // Explicitly type user
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = generateToken(user.id, user.roles, email);

    return sendSuccess(res, 200, {
      user,
      token: token,
    });
    
  });
  public forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const resetLink = passLink;
    const { email } = req.body;

    const user = (await User.findOne({ email })) as IUser; 
    if (!user)
      throw new AppError(
        "The email address " +
          req.body.email +
          " is not associated with any account. Double-check your email address and try again.",
        401
      );

    //Generate and set password reset token
    const getToken = createTokenUser(user.id);

    user.resetToken = generateToken(getToken.id, user.roles, email);
    await user.save();

    const link = `${process.env.CLIENT_URL}/reset-password/${user.resetToken}`;

    await resetLink(user, link);

    return sendSuccess(res, 200, {
      message: "A link to rest your password has been sent to your email.",
    });
  });

  public resetPassword = catchAsync(async (req: Request, res: Response) => {
    try {
      const resetToken = req.params.resetToken;

      const targetUser = await User.findOne({ resetToken });

      if (targetUser) {
        const { newPassword } = req.body;
        targetUser.password = newPassword;

        targetUser.resetToken = undefined!;

        targetUser.save();

        return sendSuccess(res, 200, {
          message: "Password updated successfully.",
        });
      } else {
        throw new AppError("Password reset link has expired.", 403);
      }
    } catch (err) {
      throw new AppError("User not found / password incorrect", 500);
    }
  });
}

export default AuthController;
