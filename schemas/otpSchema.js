import { mongoose } from 'mongoose';

const { Schema } = mongoose;

const otpSchema = new Schema({
    jwt: {type: String, required: true},
    otp: {type: String, required: true},
    // createdAt: {type: Date, default: Date.now} // expires in 30 seconds
});

// otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 5 });

export const Otp = mongoose.model('Otp', otpSchema);