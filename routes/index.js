import express from 'express';
import {userRouter} from './users.js';
import { isUserSignedin } from '../middlewares/authentication.js';

export const router = express.Router();

// importing the controllers
import { homeController } from '../controllers/HomeController.js';
import { sendEmailController } from '../controllers/EmailController.js';
import { sendSmsController } from '../controllers/SMSController.js';

router.get('/', isUserSignedin, homeController);
router.post('/send-email', isUserSignedin, sendEmailController);
router.post('/send-otp', isUserSignedin, sendSmsController);

router.use('/users', userRouter);