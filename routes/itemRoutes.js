const express = require('express');
const router = express.Router();
const Item = require('../models/item');

// Get all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.render('index', { items });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get form for new item
router.get('/new', (req, res) => {
    res.render('new');
});

// Create an item
router.post('/', async (req, res) => {
    const item = new Item({
        name: req.body.name,
        description: req.body.description,
    });

    try {
        const newItem = await item.save();
        res.redirect('/items');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get form for editing an item
router.get('/:id/edit', getItem, (req, res) => {
    res.render('edit', { item: res.item });
});

// Update an item
router.post('/:id', getItem, async (req, res) => {
    if (req.body.name != null) {
        res.item.name = req.body.name;
    }
    if (req.body.description != null) {
        res.item.description = req.body.description;
    }

    try {
        const updatedItem = await res.item.save();
        res.redirect('/items');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an item
router.post('/:id/delete', getItem, async (req, res) => {
    try {
        await Item.deleteOne({ _id: req.params.id });
        res.redirect('/items');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getItem(req, res, next) {
    let item;
    try {
        item = await Item.findById(req.params.id);
        if (item == null) {
            return res.status(404).json({ message: 'Cannot find item' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.item = item;
    next();
}

module.exports = router;
