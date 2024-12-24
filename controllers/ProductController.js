import { Product } from "../schemas/productSchema.js";
import { findMatchingProducts } from '../Utilities/HelperFunctions.js';
import { Order } from '../schemas/orderSchema.js';
import { Feedback } from '../schemas/feedbackSchema.js';

export const addProducts = async (req, res) => {
    try {
        const products = req.body.products;
        if (!products || !products.length) {
            return res.status(400).send('Please provide products data');
        }
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            if (!product.name || !product.price || !product.description || !product.countInStock) {
                return res.status(400).send('Please provide all the necessary details of the product');
            }
            if (product.price <= 0 || product.countInStock <= 0) {
                return res.status(400).send('Price and countInStock should be greater than 0');
            }
        }
        await Product.insertMany(products);
        // I need to use a post hook instead of a pre hook
        return res.status(201).send('All the Products got added successfully');
    } catch(err) {
        console.log(err);
        return res.status(500).send('There is some server error, please try in some other time');
    }
}

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        return res.status(200).send(products);
    } catch(err) {
        console.log(err);
        return res.status(500).send('There is some server error, please try in some other time');
    }
}

export const searchProducts = async (req, res) => {
    try {
        const selectedProducts = await findMatchingProducts(req.params.keywords, null, 5);
        const productIds = selectedProducts.map((product) => product.productId);
        const products = await Product.find({_id: {$in: productIds}});
        return res.status(200).send(products);
    } catch(err) {
        console.log(err);
        return res.status(500).send('There is some server error, please try in some other time');
    }
}

export const addFeedback = async (req, res) => {
    try {
        const {productId, rating, feedback, orderId} = req.body;
        const userId = req.customData.userId;
        if (!productId || !userId || !rating || !orderId) {
            return res.status(400).send('Please provide all the necessary details');
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).send('Rating should be between 1 and 5');
        }
        // check if the user has purchased that product in that order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(400).send('Order not found');
        }
        let productFound = false;
        order.products.map((product) => {
            if (product.productId == productId) {
                productFound = true;
            }
        });
        if (!productFound) {
            return res.status(400).send('You have not purchased this product');
        }
        const feedbackPresent = await Feedback.findOne({productId, userId, orderId});
        console.log(feedbackPresent);
        if (feedbackPresent) {
            await feedbackPresent.updateOne({rating, feedback});
            return res.status(200).send('Feedback updated successfully');
        }
        await Feedback.create({productId, userId, rating, feedback, orderId});
        return res.status(201).send('Feedback added successfully');
    } catch (err) {
        console.log(err);
        return res.status(500).send('There is some server error, please try in some other time');
    }
}