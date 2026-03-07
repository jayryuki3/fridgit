import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/suggestions', async (req, res) => {
  const { ingredients } = req.query;
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Spoonacular API key not configured. Add it in Settings or during setup.' });
  }
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=10&apiKey=${apiKey}`
    );
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `Spoonacular error: ${errText}` });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Recipe suggestions error:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

router.get('/:id', async (req, res) => {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Spoonacular API key not configured' });
  }
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${req.params.id}/information?apiKey=${apiKey}`
    );
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch recipe details' });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

export default router;
