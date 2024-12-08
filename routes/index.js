import express from 'express';
import { userRouter } from './users.js';
import { productRouter } from './products.js';
import { isUserSignedin } from '../middlewares/authentication.js';

export const router = express.Router();

// importing the controllers
import { homeController } from '../controllers/HomeController.js';
import { sendSmsController, sendEmailController, verifyOtpController } from '../controllers/OtpController.js';

router.get('/', isUserSignedin, homeController);
router.post('/send-email', isUserSignedin, sendEmailController);
router.post('/send-otp', isUserSignedin, sendSmsController);
router.get('/verify-otp/:otp', isUserSignedin, verifyOtpController);

router.use('/users', userRouter);
router.use('/products', productRouter);