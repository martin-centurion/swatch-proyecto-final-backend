import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    first_name:  { type: String, required: true },
    last_name:   { type: String, required: true },
    email:       { type: String, unique: true },
    age:         { type: Number, required: true },
    password:    { type: String, required: true },
    provider: String,
    cart:        { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    documents:   [ { name: { type: String }, reference: { type: String } } ],
    last_connection: { type: Date, default: null },
    role:        { type: String, enum: ['user', 'admin', 'premium'], default: 'user' },
    jwtTocken:   { type: String },
}, { timestamps: true });

userSchema.pre('find', function () {
    this.populate('cart');
});

userSchema.post('save', async function (doc) {
    if (!doc.cart) {
      const Cart = mongoose.model('Cart');
      const cart = await Cart.create({ user: doc._id, products: [] });
      doc.cart = cart._id;
      await doc.save();
    }
  });

export default mongoose.model('User', userSchema);
