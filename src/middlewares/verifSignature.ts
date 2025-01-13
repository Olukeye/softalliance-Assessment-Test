import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const verifySignature = (req: Request, res: Response, next: NextFunction): void => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const hash = crypto
    .createHmac('sha512', secret as string)
    .update(JSON.stringify(req.body))
    .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      res.status(400).send('Invalid signature');
      return;
    }
    console.log(hash);
  next();
};
