import express from 'express';
import authRouter from './routes/auth.js';
import { globalErrorHandler } from './middleware/auth.middleware.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth',authRouter);
app.use(globalErrorHandler);


export default app;