# Fridgit

A smart fridge inventory app with barcode scanning, recipe suggestions, meal planning, and calorie tracking. Built for local network use -- run it on any machine, access it from any device on your network.

## Features

- **Fridge Inventory** -- Track items across fridge, freezer, pantry, and counter with quantities and expiry dates
- **Barcode Scanner** -- Camera-based scanning via html5-qrcode with auto-lookup from Open Food Facts
- **Product Search** -- Find products by name, get nutrition info automatically
- **Shopping List** -- Manual entries + auto-generated from expiring/low-stock items
- **Recipe Suggestions** -- Select ingredients from your fridge, find matching recipes via Spoonacular
- **Meal Planning** -- Save recipes to your meal plan with date and meal type
- **Calorie Tracking** -- Log consumed items, view daily calorie history
- **Settings** -- Notification toggles, expiry warning threshold, sign out

## Tech Stack

| Layer | Tech |
|-------|------|
| Server | Node.js, Express, PostgreSQL, JWT auth, bcrypt |
| Client | React 18, Vite 5, Tailwind CSS, React Router 6 |
| APIs | Open Food Facts (barcode/product), Spoonacular (recipes) |

## Quick Start

```bash
git clone https://github.com/jayryuki3/fridgit.git
cd fridgit
npm run install:all
npm run dev
```

Open `http://localhost:5173`. On first launch you'll see the setup wizard -- enter your Postgres connection details. The app auto-creates the database, tables, and a JWT secret.

Access from other devices on your network at `http://YOUR_LOCAL_IP:5173`.

## Project Structure

```
fridgit/
├── package.json              # Root scripts (install:all, dev, start)
├── server/
│   ├── index.js              # Express server entry
│   ├── db/
│   │   ├── index.js          # PostgreSQL pool
│   │   └── schema.js         # Auto-migration
│   ├── middleware/auth.js     # JWT middleware
│   ├── utils/
│   │   ├── jwt.js            # Token generation/verification
│   │   └── password.js       # bcrypt hashing
│   ├── services/
│   │   └── openfoodfacts.js  # Barcode & product lookup
│   └── routes/
│       ├── setup.js          # First-run wizard
│       ├── auth.js           # Register/login/me
│       ├── items.js          # CRUD + consume + expiring
│       ├── barcode.js        # Barcode lookup & search
│       ├── shopping-list.js  # Shopping list + auto-generate
│       ├── meals.js          # Meal planning
│       ├── recipes.js        # Spoonacular proxy
│       ├── calories.js       # Calorie logging
│       └── settings.js       # User settings
└── client/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── public/fridgit.svg
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── services/api.js
        ├── hooks/useAuth.jsx
        ├── components/Layout.jsx
        └── pages/
            ├── Setup.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Home.jsx
            ├── Fridge.jsx
            ├── NewItem.jsx
            ├── ShoppingList.jsx
            ├── Recipes.jsx
            └── Settings.jsx
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/setup/status | Check if configured |
| POST | /api/setup/test | Test DB connection |
| POST | /api/setup/configure | Save config + init DB |
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Current user |
| GET | /api/items | List all items |
| POST | /api/items | Add item |
| PUT | /api/items/:id | Update item |
| DELETE | /api/items/:id | Delete item |
| POST | /api/items/:id/consume | Consume item |
| GET | /api/items/expiring | Expiring items |
| GET | /api/barcode/:code | Lookup barcode |
| GET | /api/barcode/search/:query | Search products |
| GET | /api/shopping-list | List shopping items |
| POST | /api/shopping-list | Add shopping item |
| PUT | /api/shopping-list/:id | Update shopping item |
| DELETE | /api/shopping-list/:id | Delete shopping item |
| POST | /api/shopping-list/auto-generate | Auto-generate from expiring |
| GET | /api/meals | List meals |
| POST | /api/meals | Add meal |
| DELETE | /api/meals/:id | Delete meal |
| GET | /api/recipes/suggestions | Find recipes by ingredients |
| GET | /api/recipes/:id | Get recipe details |
| GET | /api/calories/history | Calorie history |
| GET | /api/calories/:date | Single day calories |
| POST | /api/calories | Log calories |
| GET | /api/settings | Get settings |
| PUT | /api/settings | Update settings |

## License

MIT