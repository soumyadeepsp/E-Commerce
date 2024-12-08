import { mongoose } from 'mongoose';

const { Schema } = mongoose;

const productTokensSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Products' }, 
    // type will store the product id of a document in the Products collection   
    // this key is referring to the Products collection
    tokenArray: [{ type: String }]
});

export const ProductTokens = mongoose.model('ProductTokens', productTokensSchema);