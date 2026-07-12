import express from 'express';
import productRouter from './routes/productRoutes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/product',productRouter);


export default app;