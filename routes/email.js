import express from 'express';

export const emailRouter = express.Router();

// importing the controllers
import { sendEmailController } from '../controllers/EmailController';

emailRouter.post('/send-email', sendEmailController);