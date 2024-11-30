import express from 'express';

export const smsRouter = express.Router();

// importing the controllers
import { sendSmsController } from '../controllers/SMSController';

smsRouter.post('/send-email', sendSmsController);