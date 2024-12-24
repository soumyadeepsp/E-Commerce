import { mongoose } from 'mongoose';

const { Schema } = mongoose;

const feedbackSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true},
    feedback: {type: String},
    rating: {type: Number, required: true},
    productId: {type: Schema.Types.ObjectId, required: true},
    orderId: {type: Schema.Types.ObjectId, required: true},
});

export const Feedback = mongoose.model('Feedback', feedbackSchema);