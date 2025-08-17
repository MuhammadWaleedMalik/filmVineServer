import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import  Dashboard  from "../models/dasboard.js";
import { Request, Response } from "express";
import { User } from "../models/user.js";

export const createPaymentIntent = TryCatch(async (req: Request, res: Response) => {
  try {
    const { amount, paymentMethodId, country, user } = req.body;
    
 
    if (!amount || !paymentMethodId || !country ) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true, // ✅ Allow automatic payment methods
        allow_redirects: "never", // ✅ Prevents redirect-based methods
      },
    });

    // Determine credits based on amount
    let credits = 0;
    if (amount === 2500) credits = 60;
    else if (amount === 5000) credits = 120;
    else if (amount === 10000) credits = 240;

    // Update the Dashboard document
    const dashboard = await Dashboard.findOneAndUpdate(
      {}, // Assuming there's only one dashboard document
      {
        $inc: {
          totalSubscriptions: 1,
          totalTransactions: 1,
          totalIncome: amount / 100, // Convert amount from cents to dollars
        },
      },
      { new: true, upsert: true } // Create the document if it doesn't exist
    );
    
    // Save the updated dashboard document
    await dashboard.save();

    // Update user credits
    const usergot = await User.findByIdAndUpdate(user._id, { $inc: { credits } }, { new: true });
    if (!usergot) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, message: "Payment successful!", credits: usergot.credits });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
