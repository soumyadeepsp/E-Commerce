import express from 'express';
import {userRouter} from './users.js';

export const router = express.Router();

// importing the controllers
import {homeController} from '../controllers/HomeController.js';

router.get('/', homeController);

router.use('/users', userRouter);