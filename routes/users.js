import express from 'express';

export const userRouter = express.Router();

// importing the controllers
import { signup, signin, signout } from '../controllers/UsersController.js';

userRouter.post('/signup', signup);
userRouter.post('/signin', signin);
userRouter.get('/signout', signout);