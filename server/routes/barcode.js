import express from 'express';
import { lookupBarcode, searchProducts, normalizeProduct } from '../services/openfoodfacts.js';

const router = express.Router();

router.get('/:code', async (req, res) => {
  try {
    const product = await lookupBarcode(req.params.code);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(normalizeProduct(product));
  } catch (error) {
    res.status(500).json({ error: 'Failed to lookup barcode' });
  }
});

router.get('/search/:query', async (req, res) => {
  try {
    const products = await searchProducts(req.params.query);
    res.json(products.map(p => normalizeProduct(p)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to search products' });
  }
});

export default router;
