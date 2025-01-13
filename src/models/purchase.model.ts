import mongoose, { Schema, Document } from 'mongoose';

interface IPurchase extends Document {
  reference: string;
  email: string;
  amount: number;
  status: string;
  createdAt: Date;
}

const PurchaseSchema: Schema = new Schema(
  {
    reference: { type: String, unique: true },
    email: { type: String },
    amount: { type: Number },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model<IPurchase>('Purchase', PurchaseSchema);
