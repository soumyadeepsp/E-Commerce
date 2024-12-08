import { mongoose } from 'mongoose';

const { Schema } = mongoose;

const passwordResetUrlSchema = new Schema({
    url: {type: String, required: true},
    email: {type: String, required: true}
});

export const PasswordResetUrl = mongoose.model('PasswordResetUrl', passwordResetUrlSchema);