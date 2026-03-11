import express from 'express';
import db from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM meals WHERE user_id = $1 ORDER BY date DESC, created_at DESC', [req.user.userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/consumed', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT m.*, i.calories as item_calories, i.protein as item_protein, i.carbs as item_carbs, i.fat as item_fat, i.unit as item_unit, i.emoji, i.category as item_category
       FROM meals m
       LEFT JOIN items i ON m.item_id = i.id
       WHERE m.user_id = $1 AND m.meal_type = 'consumed'
       ORDER BY m.consumed_at DESC`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  const { servings, date } = req.body;
  try {
    const existing = await db.query('SELECT * FROM meals WHERE id = $1 AND user_id = $2', [req.params.id, req.user.userId]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Meal not found' });

    const meal = existing.rows[0];
    const newServings = servings ?? meal.servings;

    let newCalories = meal.calories;
    if (servings !== undefined && meal.item_id) {
      const item = await db.query('SELECT calories FROM items WHERE id = $1', [meal.item_id]);
      if (item.rows.length > 0) {
        const baseCal = parseFloat(item.rows[0].calories) || 0;
        newCalories = Math.round(baseCal * newServings);
      }
    }

    const result = await db.query(
      `UPDATE meals SET servings = COALESCE($1, servings), date = COALESCE($2, date), calories = $3 WHERE id = $4 AND user_id = $5 RETURNING *`,
      [servings, date, newCalories, req.params.id, req.user.userId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { name, date, meal_type, recipe_id, ingredients, calories } = req.body;
  if (!name || !date) return res.status(400).json({ error: 'name and date required' });
  try {
    const result = await db.query(
      'INSERT INTO meals (user_id, name, date, meal_type, recipe_id, ingredients, calories) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [req.user.userId, name, date, meal_type || 'dinner', recipe_id, ingredients, calories]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM meals WHERE id = $1 AND user_id = $2', [req.params.id, req.user.userId]);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
