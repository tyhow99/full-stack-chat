import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";

import {app,server} from "./lib/socket.js"

import { connectDB } from './lib/db.js';


dotenv.config();



app.use(express.json());
app.use(cookieParser());
app.use(cors(
  { origin:"http://localhost:5173", credentials: true, methods: 'GET, POST, PUT'}
));



app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)
const PORT = process.env.PORT;

//listens on port 5001
server.listen(PORT, () => {
  console.log('Server is running on PORT: '+ PORT);
  connectDB();
});