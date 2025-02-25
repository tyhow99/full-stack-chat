import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';



import { connect } from 'mongoose';
import { connectDB } from './lib/db.js';


dotenv.config();
const app = express();


app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)
const PORT = process.env.PORT;

//listens on port 5001
app.listen(PORT, () => {
  console.log('Server is running on PORT: '+ PORT);
  connectDB();
});