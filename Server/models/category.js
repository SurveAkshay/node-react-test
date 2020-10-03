const mongoose = require('mongoose');
const Product = require('./product');

const categorySchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        unique: true,
        lowercase: true
    }
});

// virtual property
categorySchema.virtual('products', {
    ref:'Product',
    localField: '_id',
    foreignField: 'category'
})

// delete related products when a particular category is removed
categorySchema.pre('remove', async function (next) {
    const _id = this._id;

    await Product.deleteMany({category: _id})
    next()
})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;