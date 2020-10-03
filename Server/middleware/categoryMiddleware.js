const Category = require('../models/category');

// middleware for linking a category to product
const categoryMiddleware = async (req,res,next) => {
    try {
        const category = await Category.findOne({name: req.body.category});
        console.log(category)
        if(!category) {
            throw new Error()
        }

        req.category = category;
        next()
    } catch (e) {
        console.log(req.body)
        res.status(404).send({error: "category not found"})
    }
}

module.exports = categoryMiddleware