import mongoose, { Schema, Document, Types} from "mongoose";
import bcrypt from "bcrypt";
import { Roles } from "../utils/constant";

export interface IUser extends Document {
  _id:Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
  verifiedEmail: boolean;
  comparePassword: (enteredPassword: string) => boolean;
  resetToken?: string;
  tokenExpiry?: Date;
  _doc:any;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
  },
  verifiedEmail: {
    type: Boolean,
    default: false,
  },
  roles: {
    type: [String],
    required: true,
    default: [Roles.User],
  },
  tokenExpiry: Date,
});

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
  // Add a method to compare passwords
  userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  // Create the User model
  const User = mongoose.model<IUser>("User", userSchema);
  
  export { User };
