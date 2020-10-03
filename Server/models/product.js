const mongoose = require('mongoose');
// product schema 
// category schema is reference local field is id
const prodctSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, default: 0, required: true },
    category: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category' 
    },
    countInStock: { type: Number, default: 0, required: true },
    description: { type: String, required: true },
});

const Product = mongoose.model('Product', prodctSchema);

module.exports = Product;
