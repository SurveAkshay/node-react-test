const express = require('express');
const fs = require('fs');
const path = require('path');
const Product = require('../models/product');
const router = new express.Router();

// below are the middleware for handling category --->product relation and image uploading(used for checking blob file)
const catMiddleware = require('../middleware/categoryMiddleware')
const singleImageUploadMiddleware = require('../middleware/singleImageUpload');


// route for creating product
router.post('/products', singleImageUploadMiddleware.single("image"),catMiddleware, async (req, res) => {
    const url = req.protocol + '://' + req.get('host');
    var product;

    // if not a blob file
    if(!req.file) {
        product = new Product({
            ...req.body,
            category: req.category._id,
            image: `${req.body.image}`
        })
    } else {
        // if a blob file
        product = new Product({
            ...req.body,
            category: req.category._id,
            image: `${url}/static/${req.file.originalname}`
        })
    }
    
    try {
        await product.save()
        res.status(201).send(product)
    } 
    catch (e) {
        res.status(400).send(e);
    }

})

// for pagination we can have limit=somevalue&skip=somevalue
// route for getting all products
router.get('/products', async (req,res) => {
    
    // for sorting products ascending and descending order
    // const sort = {}

    // if(req.query.sortBy) {
    //     const parts = req.query.sortBy.split('-');
    //     sort[parts[0]] = parts[1] === 'desc'? -1: 1 ;
    // }

    try {
        // const products = await Product.find({}).sort(sort);
        const products = await Product.find({});
        if(!products) { 
            return res.status(404).send() 
        }

        res.send(products)
    } catch (e) {
        res.status(500).send(e)
    }
})

// route for getting a product by id 
router.get('/products/:id', async (req,res) => {
    const _id = req.params.id
    try {
        const product = await Product.findById(_id);
        if(!product) { 
            return res.status(404).send() 
        }

        res.send(product)
    } catch (e) {
        res.status(500).send(e)
    }
})

// route for updating product by id
router.patch('/products/:id',catMiddleware, async (req,res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','brand','price','category','countInStock','description'];
    const isvalidOperation = updates.every((update) => allowedUpdates.includes(update) );
    if(!isvalidOperation) {
        // if updating any unknown category return 400
        return res.status(400).send({error: 'invalid updates!'})
    }
    try {
        const product = await Product.findOne({_id});
        if(!product) {
            return res.status(404).send('no product found to update')
        }

        updates.forEach((update) => {
            if(update == 'category') {
                product[update] = req.category._id;
            } else {
                product[update] = req.body[update]
            }
        })
        await product.save();

        res.send(product);
    } catch (e) {
        res.status(400).send(e)
    }
})

// route for deleting a product by id
router.delete('/products/:id', async (req,res) =>{
    const _id = req.params.id;
    try {
        const product = await Product.findOneAndDelete({_id})
        if(!product) {
            return res.status(404).send('no product found to delete')
        }
        res.send(product);
    } catch (e) {
        res.status(500).send(e)
    }
})

// route for updating product image by id
router.patch('/products/updateproductimage/:id', singleImageUploadMiddleware.single("image"), async (req,res) => {
    const _id = req.params.id;
    const url = req.protocol + '://' + req.get('host');
    var product;
    if(!req.file) {
        // if not a blob file
        try {
            product = await Product.findOne({_id})
           
            if(!product) {
                return res.status(404).send('no product found to update')
            }
            
            product.image = req.body.image;
            await product.save();
            
            if(req.body.old_img) {
                // console.log(req.body.old_img);
                const old_img_path = "../" + req.body.old_img;
                // console.log(old_img_path);
                const pathname = path.join(__dirname,old_img_path)
                // console.log("pathname" , pathname);
                deleteImage(pathname);
            }

            res.send(product);
        } catch (e) {
            res.status(400).send(e)
        }
    } else {
        try {
            product = await Product.findOne({_id})
           
            if(!product) {
                return res.status(404).send('no product found to update')
            }
            
            product.image = `${url}/static/${req.file.originalname}`;
            await product.save();
            
            if(req.body.old_img) {
                // console.log(req.body.old_img);
                const old_img_path = "../" + req.body.old_img;
                // console.log(old_img_path);
                const pathname = path.join(__dirname,old_img_path)
                // console.log("pathname" , pathname);
                deleteImage(pathname);
            }

            res.send(product);
        } catch (e) {
            res.status(400).send(e)
        }
    }
})

//  function for deleting images stored on public directory of server(when new image for a product is uploaded) 
const deleteImage = (pathname) => {
    fs.unlink(pathname, function(err) {
        if (err) throw err;
        console.log('File deleted!');    
    });
}

module.exports = router;