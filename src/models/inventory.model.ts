import mongoose, { Schema, Document } from 'mongoose';

interface IItem extends Document {
  name: string;
  quantity: number;
  price: number;
  category: string;
  description?: string;
  minimumQuantity?: number;
}

const itemSchema: Schema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  minimumQuantity: { type: Number, default: 1 },
});

const Item = mongoose.model<IItem>('Item', itemSchema);

export default Item;
