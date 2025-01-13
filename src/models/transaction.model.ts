import mongoose, { Schema } from "mongoose";

interface ITransaction extends Document {
    itemId: mongoose.Types.ObjectId;
    type: 'SALE' | 'RESTOCK';
    quantity: number;
    date: Date;
  }
  
  const transactionSchema: Schema = new Schema({
    itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    type: { type: String, enum: ['SALE', 'RESTOCK'], required: true },
    quantity: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  });
  
  const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
  
  export default Transaction;
  