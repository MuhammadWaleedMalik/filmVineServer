import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Dashboard document
interface IDashboard extends Document {
  totalUsers: number;
  totalSubscriptions: number;
  totalTransactions: number;
  totalIncome: number;
  usersThisMonth: number;
  packages: {
    basic: { price: number; count: number };
    enterprise: { price: number; count: number };
    pro: { price: number; count: number };
  };
}

// Define the schema
const DashboardSchema: Schema = new Schema({
  totalUsers: { type: Number, required: false, default: 0 },
  totalSubscriptions: { type: Number, required: false, default: 0 },
  totalTransactions: { type: Number, required: false, default: 0 },
  totalIncome: { type: Number, required: false, default: 0 },
  usersThisMonth: { type: Number, required: false, default: 0 },
  packages: {
    basic: { price: { type: Number, default: 25 }, count: { type: Number, default: 0 } },
    enterprise: { price: { type: Number, default: 50 }, count: { type: Number, default: 0 } },
    pro: { price: { type: Number, default: 100 }, count: { type: Number, default: 0 } },
  },
});

// Create and export the model
const Dashboard = mongoose.model<IDashboard>('Dashboard', DashboardSchema);
export default Dashboard;