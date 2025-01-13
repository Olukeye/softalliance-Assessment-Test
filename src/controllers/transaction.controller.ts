import { NextFunction, Request, Response } from "express";
import Transaction from '../models/transaction.model';
import Item from "../models/inventory.model"
import { sendSuccess } from "../utils/response";
import AppError from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

class Transactions {
    public updateStock = catchAsync(async(req: Request, res:Response, next:NextFunction) => {
        try {
            const { itemId, type, quantity } = req.body;
        
            if (!itemId || !type || !quantity) {
               throw new AppError('Missing required fields',400);
            }
        
            if (!['SALE', 'RESTOCK'].includes(type)) {
                throw new AppError("Invalid transaction type",400)
            }
        
            const item = await Item.findById(itemId);
            if (!item) {
              throw new AppError('Item not found', 404);
            }
        
            if (type === 'SALE' && item.quantity < quantity) {
              throw new AppError('Insufficient stock', 400);  // Check stock for sales
            }
        
            item.quantity += type === 'SALE' ? -quantity : quantity; // Adjust stock based on transaction type
        
            await item.save();
            await Transaction.create({ itemId, type, quantity });
        
            return sendSuccess(res, 200, {
                message: "Stock updated successfully",
                item
            });
        } catch (error) {
        console.error(error);
        throw new AppError( 'An error occurred', 400);
        }
    });

    public generateStockReport = catchAsync(async (req: Request, res:Response) => {
        try {
            const { type } = req.query;

            if (type === 'out-of-stock') {
            const outOfStockItems = await Item.find({ quantity: 0 });
            return sendSuccess(res, 200, {
                type,
                data: outOfStockItems 
            });
            }

            if (type === 'sales-summary') {
            const salesSummary = await Transaction.aggregate([
                { $match: { type: 'SALE' } },
                { $group: { _id: '$itemId', totalSold: { $sum: '$quantity' } } },
                { $sort: { totalSold: -1 } }
            ]);
            return sendSuccess(res, 200, {
                    type,
                    data: salesSummary 
                });
            }

            if (type === 'low-stock') {
            const lowStockItems = await Item.find({ quantity: { $lt: '$minimumQuantity' } });
                return sendSuccess(res, 200, {
                    type,
                    data: lowStockItems 
                });
            }

            throw new AppError('Invalid report type', 400);
        } catch (error) {
            throw new AppError( 'An error occurred', 400);
        }
    });

}

export default Transactions;
