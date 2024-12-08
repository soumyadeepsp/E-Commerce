import { mongoose } from 'mongoose';

const { Schema } = mongoose;

const cartSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true},
    products: [{
        productId: {type: Schema.Types.ObjectId, required: true},
        quantity: {type: Number, required: true},
        price: {type: Number, required: true},
    }],
});

export const Cart = mongoose.model('Cart', cartSchema);