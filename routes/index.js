import express from 'express';
import {userRouter} from './users.js';
import { isUserSignedin } from '../middlewares/authentication.js';

export const router = express.Router();

// importing the controllers
import {homeController} from '../controllers/HomeController.js';

router.get('/', isUserSignedin, homeController);

router.use('/users', userRouter);