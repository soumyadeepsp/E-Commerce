import { mongoose } from 'mongoose';
import { ProductTokens } from './productTokens.js';
import { removeSpecialCharacters } from '../Utilities/HelperFunctions.js';

const { Schema } = mongoose;

const productSchema = new Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    image: {type: String},
    brand: {type: String},
    category: {type: String},
    countInStock: {type: Number, required: true},
    rating: {type: Number},
    numReviews: {type: Number},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

productSchema.post('insertMany', function(docs) {
    docs.map(async (doc) => {
        let name = removeSpecialCharacters(doc.name).toLowerCase();
        let brand = removeSpecialCharacters(doc.brand).toLowerCase();
        let description = removeSpecialCharacters(doc.description).toLowerCase();
        const tokenArray = name.split(" ").concat(brand.split(" "), description.split(" "));
        await ProductTokens.create({productId: doc._id, tokenArray});
    });
});

export const Product = mongoose.model('Product', productSchema);