const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('./products'); 
// --- API Routes ---

// GET / - list with filtering, search, pagination
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;

    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' }; // case-insensitive search
    }
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      data: products,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    next(err);
  }
});

// GET /:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST / - create new product
router.post('/', async (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    const newProduct = new Product({ name, description, price, category, inStock });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// PUT /:id
router.put('/:id', async (req, res, next) => {
  try {
    const updates = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE /:id
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Product not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Export the router
module.exports = router;