import express from 'express';
import { isUserSignedin } from '../middlewares/authentication.js';

export const userRouter = express.Router();

// importing the controllers
import { signup, signin, signout, sendResetPasswordUrl, 
    updatePassword, addToCart, addOrder, getOrders, 
    searchProductInOrders } from '../controllers/UsersController.js';

userRouter.post('/signup', signup);
userRouter.post('/signin', signin);
userRouter.get('/signout', signout);
userRouter.post('/reset-password', sendResetPasswordUrl);
userRouter.put('/update-password', updatePassword);
userRouter.post('/add-to-cart', isUserSignedin, addToCart);
userRouter.post('/add-order', isUserSignedin, addOrder);
userRouter.get('/get-orders', isUserSignedin, getOrders);
userRouter.get('/search-orders/:keywords', isUserSignedin, searchProductInOrders);