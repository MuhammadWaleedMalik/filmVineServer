import express from "express";
import {

  createPaymentIntent,
 
} from "../controllers/payment.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

// route - /api/v1/payment/create
app.post("/create",adminOnly, createPaymentIntent);





export default app;
