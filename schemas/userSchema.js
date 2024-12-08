import { mongoose } from 'mongoose';
import bcrypt from 'bcrypt';
import { hashPassword } from '../Utilities/HelperFunctions.js';

const { Schema } = mongoose;

const userSchema = new Schema({
    firstname: {type: String, required: true}, 
    lastname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    mobile: {type: Number, required: true},
    address: {type: String, required: true}, 
    pin: {type: Number, required: true}, 
    sessionToken: {type: String},
    lastLogInTime: {type: Date},
    verifiedEmail: {type: Boolean, required: true, default: false},
    verifiedMobile: {type: Boolean, required: true, default: false}
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        try {
            this.password = await hashPassword(this.password);
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

export const User = mongoose.model('User', userSchema);