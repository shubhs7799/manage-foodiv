# FooDiv - Restaurant Delivery App

A restaurant delivery application built with React, Redux Toolkit, Tailwind CSS, Express, and MongoDB.

## Features

### User Interface
- Browse food categories and recipes
- **Fuzzy search** (Fuse.js) — typos like "chiken" still find "Chicken"
- **Voice search** — speak to search using Web Speech API
- **Smart recommendations** — "Goes great with your order" suggestions on cart page
- Shopping cart with localStorage persistence
- Checkout with delivery address and phone validation
- Order history with status tracking

### Admin Panel
- Dashboard with stats overview
- Category management (CRUD)
- Recipe management (CRUD)
- Order status management
- Responsive sidebar (mobile-friendly)

### Performance & Security
- **Lazy loading** — pages code-split with React.lazy (305KB main + on-demand chunks)
- Server-side order price validation
- CORS restricted to frontend origin
- Rate limiting on auth routes
- MongoDB indexes on frequently queried fields
- Cart persisted to localStorage

## Tech Stack

- **Frontend**: React 19 + Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **Search**: Fuse.js (fuzzy matching)
- **Icons**: Lucide React
- **Backend**: Express.js + MongoDB (Mongoose)
- **Auth**: JWT + bcryptjs
- **Security**: express-rate-limit, CORS, server-side validation

## Setup

### 1. Clone and install

```bash
# Frontend
npm install

# Backend
cd server
npm install
```

### 2. Configure environment

Create `server/.env`:

```
PORT=5001
MONGO_URI=mongodb://localhost:27017/foodiv
JWT_SECRET=your_random_secret_here
CORS_ORIGIN=http://localhost:5173
```

Create `.env` in root:

```
VITE_API_URL=http://localhost:5001/api
```

### 3. Seed data (optional)

```bash
cd server
ADMIN_PASSWORD=your_secure_password node seed.js
```

### 4. Run

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5001

## Project Structure

```
src/
├── components/
│   ├── admin/        # AdminLayout, AdminSidebar
│   ├── user/         # UserHeader, UserLayout
│   └── common/       # RecipeCard, EmptyState, Loader, Recommendations
├── pages/
│   ├── admin/        # Dashboard, CategoryManager, RecipeManager, OrdersManager
│   ├── HomePage, CartPage, CheckoutPage, SearchResultsPage, etc.
├── redux/slices/     # authSlice, cartSlice, recipesSlice, ordersSlice, categoriesSlice
├── services/         # api.js (fetch wrapper)
├── constants/        # DELIVERY_FEE, STATUS_COLORS, ORDER_STATUSES
├── utils/            # formatDate, formatCurrency
├── hooks/            # useVoiceSearch
└── App.jsx

server/
├── config/           # db.js
├── controllers/      # authController, categoryController, recipeController, orderController, recommendationController
├── middleware/        # auth.js (JWT + role check)
├── models/           # User, Category, Recipe, Order
├── routes/           # auth, categories, recipes, orders, recommendations
├── seed.js
└── server.js
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | No | Register |
| POST | /api/auth/login | No | Login (rate limited) |
| GET | /api/auth/me | Yes | Current user |
| GET | /api/categories | No | List categories |
| POST | /api/categories | Admin | Create category |
| PUT | /api/categories/:id | Admin | Update category |
| DELETE | /api/categories/:id | Admin | Delete category |
| GET | /api/recipes | No | List recipes (optional ?categoryId=) |
| GET | /api/recipes/:id | No | Get single recipe |
| POST | /api/recipes | Admin | Create recipe |
| PUT | /api/recipes/:id | Admin | Update recipe |
| DELETE | /api/recipes/:id | Admin | Delete recipe |
| GET | /api/orders | Yes | List orders (filtered by role) |
| POST | /api/orders | Yes | Create order (server validates prices) |
| PATCH | /api/orders/:id/status | Admin | Update order status |
| GET | /api/recommendations | No | Get complementary recipe suggestions |

## License

MIT
