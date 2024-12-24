import { mongoose } from 'mongoose';

const { Schema } = mongoose;

const orderSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true},
    products: [{
        productId: {type: Schema.Types.ObjectId, required: true},
        quantity: {type: Number, required: true},
        price: {type: Number, required: true},
    }],
    datetime: {type: Date, default: Date.now},
    paymentMethod: {type: String, required: true, enum: ['COD', 'CARD']}
});

export const Order = mongoose.model('Order', orderSchema);