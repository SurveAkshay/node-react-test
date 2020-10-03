const express = require('express');
const Category = require('../models/category');
const router = new express.Router();

// route for creating category
router.post('/category', async (req,res) => {
    const query = req.body.name;
    await Category.findOne({name: query},  async (err,category) => {
        if(category) {
            res.status(400).send({error: 'Category Already exists'});
        } else {
            const category = new Category({name: query});
            try {
                await category.save();
                res.status(201).send({category})
            } catch(e) {
                res.status(400).send(e);
            }
        }
    })
})

// route for getting category by id
router.get('/category/:id', async (req,res) => {
    const _id = req.params.id;
    try {
        const category = await Category.findById(_id);
        if(!category) { 
            return res.status(404).send() 
        }
        res.send(category);
    } catch(e) {
        res.status(500).send(e);
    }
})

// route for getting all category
router.get('/category', async (req,res) => {
    try {
        const categories = await Category.find({});
        res.send(categories);
    } catch(e) {
        res.status(400).send(e);
    }
})

// route for updating category by id
router.patch('/category/:id', async (req,res) => {
    const _id = req.params.id;
    try {
        const category = await Category.findById({_id});
        category.name = req.body.name;
        await category.save();
        res.send(category);
    } catch(e) {
        res.status(400).send(e);
    }
})

// route for deleting category by id
router.delete('/category/:id', async (req,res) => {
    const _id = req.params.id;
    try {
        const category = await Category.findOne({_id});
        if(!category) {
            return res.status(404).send('no category found to delete')
        }
        await category.remove();
        res.send(category);
    } catch(e) {
        res.status(500).send(e);
    }
})

module.exports = router;