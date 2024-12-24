import express from 'express';
import { isUserSignedin } from '../middlewares/authentication.js';

export const productRouter = express.Router();

// importing the controllers
import { addProducts, getProducts, searchProducts, addFeedback } from '../controllers/ProductController.js';

productRouter.post('/add-products', addProducts);
productRouter.get('/get-products', getProducts);
productRouter.get('/search/:keywords', searchProducts);
productRouter.post('/add-feedback', isUserSignedin, addFeedback);