import express from 'express';
import productRouter from './routes/productRoutes.js';
import { globalErrorHandler } from '../src/middleware/product.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/product',productRouter);
app.use(globalErrorHandler);


export default app;