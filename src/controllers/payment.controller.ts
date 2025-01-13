import { Request, Response } from "express";
import axios from 'axios';
import Purchase from '../models/purchase.model';
import { sendSuccess } from "../utils/response";
import AppError from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";


class PayStackPayment {
    public initializePayment = catchAsync(async(req: Request, res: Response)=> {
        const { email, amount } = req.body;

        try {
            // Create a purchase record with pending status
            const purchase = await Purchase.create({
                reference: `txn_${Date.now()}`,
                email,
                amount,
                status: 'pending',
            });

            // Initialize payment with Paystack
            const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email,
                amount: amount * 100, // Paystack expects amount in kobo
                reference: purchase.reference,
            },
            {
                headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
                },
            }
            );

            return sendSuccess(res, 200, {
                message: "Payment initialized successfully",
                authorization_url: response.data.data.authorization_url
            });
        } catch (error) {
            throw new AppError('Server error', 500);
        }
    });

    public paymentWebhook = catchAsync(async(req: Request, res: Response)=> {
        try {
            const event = req.body;
        
            if (event.event === 'charge.success') {
                const { reference, status, amount } = event.data;
        
                // Update purchase record
                await Purchase.findOneAndUpdate(
                { reference },
                { status: 'paid', amount: amount / 100 } // Convert amount back to Naira
                );
        
                return sendSuccess(res, 200, {
                    message: "Payment processed successfully",
                });
            }
        
            throw new AppError("Unhandled event", 400)
            } catch (error) {
           throw new AppError('Server error', 500);
        }
    });
}

export default PayStackPayment;