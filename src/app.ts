import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import { config } from "dotenv";
import morgan from "morgan";
import Stripe from "stripe";
import cors from "cors";
import https from "https";
import fs from "fs";


// Load environment variables
config({ path: "./.env" });

const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI || "";
const stripeKey = process.env.STRIPE_KEY ;

connectDB(mongoURI);
export const stripe = new Stripe(stripeKey);

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("API Working with /api/v1");
});

// Import Routes
import userRoute from "./routes/user.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/dashboard.js";
import festivalRoute from "./routes/festival.js"

app.use("/api/v1/user", userRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/festival", festivalRoute);

app.use(errorMiddleware);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 