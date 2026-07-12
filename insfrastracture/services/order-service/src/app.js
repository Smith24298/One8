import express from 'express';
import orderRouter from './routes/orderRoutes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/order',orderRouter);


export default app;