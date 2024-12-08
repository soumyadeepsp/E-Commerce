import { Product } from "../schemas/productSchema.js";
import { removeSpecialCharacters } from '../Utilities/HelperFunctions.js';
import { ProductTokens } from '../schemas/productTokens.js';

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
        let searchQuery = req.params.keywords.replaceAll('+', ' ');
        searchQuery = removeSpecialCharacters(searchQuery).toLowerCase();
        const searchTokens = searchQuery.split(' ');
        console.log(searchTokens);
        const productTokens = await ProductTokens.find({});
        const tokenMatchingScore = [];
        productTokens.map((productToken) => {
            let score = 0;
            productToken.tokenArray.map((token) => {
                if (searchTokens.includes(token)) {
                    score++;
                }
            });
            tokenMatchingScore.push({productId: productToken.productId, score});
        });
        tokenMatchingScore.sort((a, b) => {
            return b.score - a.score;
        });
        const selectedProducts = tokenMatchingScore.slice(0, 5);
        const productIds = selectedProducts.map((product) => product.productId);
        const products = await Product.find({_id: {$in: productIds}});
        return res.status(200).send(products);
    } catch(err) {
        console.log(err);
        return res.status(500).send('There is some server error, please try in some other time');
    }
}