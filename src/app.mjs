import express from 'express';
import dotenv from 'dotenv';
import blockchainRouter from './routes/blockchainRouter.mjs';
import { asyncCatch } from './middleware/asyncCatch.mjs';
import { errorHandler } from './middleware/errorHandler.mjs';
import AppError from './utilities/AppError.mjs';

dotenv.config({ path: './config/.env' });

const app = express();
app.use(express.json());
app.use('/api/blocks', blockchainRouter);

// Hantera ogiltiga rutter
app.use('*', asyncCatch(async (req, res) => {
  throw new AppError(`Cannot find ${req.originalUrl} on this server`, 404);
}));

app.use(errorHandler);

export default app;