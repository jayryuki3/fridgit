import { getPool } from './index.js';

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    household_name VARCHAR(100) DEFAULT 'Home Fridge',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    barcode VARCHAR(50),
    category VARCHAR(50),
    quantity INTEGER DEFAULT 1,
    unit VARCHAR(20) DEFAULT 'count',
    location VARCHAR(20) DEFAULT 'fridge',
    expiry_date DATE,
    calories INTEGER,
    protein VARCHAR(10),
    carbs VARCHAR(10),
    fat VARCHAR(10),
    emoji VARCHAR(10),
    color VARCHAR(10),
    shared BOOLEAN DEFAULT false,
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_items_owner ON items(owner_id);
CREATE INDEX IF NOT EXISTS idx_items_barcode ON items(barcode);
CREATE INDEX IF NOT EXISTS idx_items_expiry ON items(expiry_date);

CREATE TABLE IF NOT EXISTS meals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    date DATE NOT NULL,
    meal_type VARCHAR(20) DEFAULT 'dinner',
    recipe_id VARCHAR(50),
    ingredients TEXT[],
    calories INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_meals_user ON meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_date ON meals(date);

CREATE TABLE IF NOT EXISTS shopping_list (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 1,
    auto_generated BOOLEAN DEFAULT false,
    purchased BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_shopping_user ON shopping_list(user_id);

CREATE TABLE IF NOT EXISTS calorie_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_calories INTEGER DEFAULT 0,
    items_consumed JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_calories_user_date ON calorie_logs(user_id, date);

CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    notif_expiry BOOLEAN DEFAULT true,
    notif_recommend BOOLEAN DEFAULT true,
    notif_shared BOOLEAN DEFAULT false,
    dark_mode BOOLEAN DEFAULT false,
    expiry_warning_days INTEGER DEFAULT 7,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_settings_user ON settings(user_id);
`;

export async function initializeSchema() {
  const pool = getPool();
  try {
    await pool.query(SCHEMA_SQL);
    console.log('Database schema initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize schema:', error.message);
    return false;
  }
}
