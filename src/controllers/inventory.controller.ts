import { NextFunction, Request, Response } from "express";
import Item from "../models/inventory.model"
import { sendSuccess } from "../utils/response";
import AppError from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

class Inventory {
    public createItem = catchAsync(async(req: Request, res:Response, next:NextFunction) => {
        try {
            const newItem = await Item.create(req.body);
            return sendSuccess(res, 201, {
                message: "Inventory created successfully.",
                newItem
            });
        } catch (error) {
            throw new AppError("Bad Request made.", 400);
        }
    });

    public getItems = catchAsync(async(req:Request, res:Response, next:NextFunction) => {
        try {
        const { category } = req.query;
            const query = category ? { category } : {};
            const items = await Item.find(query);

            return sendSuccess(res, 200, {
                message: "Inventory created successfully.",
                items
            });
        } catch (error) {
            throw new AppError("User not found ", 500)
        }
    });

    public updateItem = catchAsync(async(req:Request, res:Response, next:NextFunction) => {
        try {
        const { id } = req.params;
            const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true, runValidators: true});
            if (!updatedItem) throw new AppError('Item not found', 404);

            return sendSuccess(res, 200, {
                message: "Inventory deleted successfully.",
                updatedItem
            });
        } catch (error) {
            throw new AppError("Bad Request made",400);
        }
    });

    public deleteItem = catchAsync(async(req:Request, res:Response, next:NextFunction) => {
        try {
            const { id } = req.params;
            const deletedItem = await Item.findByIdAndDelete(id);
            if (!deletedItem) throw new AppError('Item not found', 404);

            return sendSuccess(res, 200, {
                message: "Item deleted successfully",
            });
        } catch (error) {
            throw new AppError("Bad Request made",400);
        }
    })
}

export default Inventory;
