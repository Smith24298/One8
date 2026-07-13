import express from 'express';
import orderRouter from './routes/orderRoutes.js';
import  { globalErrorHandler } from '../src/middleware/order.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/order',orderRouter);
app.use(globalErrorHandler);


export default app;