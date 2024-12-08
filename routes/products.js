import express from 'express';

export const productRouter = express.Router();

// importing the controllers
import { addProducts, getProducts, searchProducts } from '../controllers/ProductController.js';

productRouter.post('/add-products', addProducts);
productRouter.get('/get-products', getProducts);
productRouter.get('/search/:keywords', searchProducts);