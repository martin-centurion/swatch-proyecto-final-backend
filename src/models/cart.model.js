import mongoose from "mongoose";
import paginator from 'mongoose-paginate-v2';

const productSubSchema = new mongoose.Schema({
    product:        { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity:       { type: Number, required: true }   
}, { _id: false });

const cartSchema = new mongoose.Schema({
    user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products:   { type: [productSubSchema], required: true, default: [] },
}, { timestamps: true });

cartSchema.plugin(paginator);

export default mongoose.model('Cart', cartSchema);