import {otpEmailTemplate, WelcomeEmailTemplate}  from '../email_handler/emailTemplates'
import bcrypt from "bcrypt";
import sendEmail from "./sendEmail"

  // Send OTP Email and Save New OTP in Database
  interface User {
    email: string;
    _id: string;
  }
  
  interface OTPModel {
    create: (otpData: { userId: string; hashedOTP: string; createdAt: number; expiresAt: number }) => Promise<void>;
  }
  
  const sendOTPemail = async (user: User, OTPModel: OTPModel) => {
    try {
      const transporter = sendEmail(); // Initialize email transporter
  
      // Generate 4-digit OTP
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      console.log(`Generated OTP: ${otp}`);
  
      // Hash OTP
      const hashedOTP = await bcrypt.hash(otp, 10);
  
      // Save OTP in the database
      await OTPModel.create({
        userId: user._id,
        hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 15 * 60 * 1000, // Expires in 15 minutes
      });
  
      // Define email options
      const mailOptions = {
        from: `"OTP Verification" <${process.env.EMAIL_USERNAME}>`,
        to: user.email,
        subject: "Verify Your Email",
        html: otpEmailTemplate(otp, "15 Minutes"),
      };
  
      // Send email
      await transporter.sendMail(mailOptions);
      console.log("Check your email for the OTP code.");
    } catch (error) {
      console.log({ err: "Internal Server Error Email connection!!" });
      throw new Error("Internal Server Error: Failed to send OTP email.");
    }
  };

  const RegisterSuccessEmail = async (user: { email: string;}) => {
    const transporter = sendEmail();
    try {
      const mailOptions = {
        from: `"New Registration"${process.env.EMAIL_USERNAME}`,
        to: `${user.email}, aninmie@gmail.com`,
        subject: "New User Welcome Email",
        html: WelcomeEmailTemplate(),
      };

      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.log({ err: "Internal Server Error Email connection!!" });
    }
  }

  export {sendOTPemail, RegisterSuccessEmail};