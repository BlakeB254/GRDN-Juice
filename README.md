# Garden District Juice - React Vite Application

Fresh cold-pressed juice e-commerce platform built with React, Vite, Express, and Drizzle ORM.

## Project Structure

```
garden-district-juice/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── pages/   # Page components (routed with wouter)
│   │   ├── components/  # Reusable UI components
│   │   └── main.tsx
│   └── index.html
├── server/          # Express backend
│   ├── index.ts     # Server entry point
│   ├── routes.ts    # API routes
│   └── vite.ts      # Vite middleware for dev
├── db/              # Database schema and config
│   ├── schema.ts    # Drizzle ORM schema
│   └── index.ts     # Database connection
├── shared/          # Shared types between client/server
│   └── types.ts
└── package.json
```

## Tech Stack

- **Frontend**: React 18, Vite 5, Wouter (routing), TanStack Query
- **Backend**: Express, Node.js
- **Database**: PostgreSQL (Neon), Drizzle ORM
- **UI**: Tailwind CSS, Radix UI
- **Auth**: JWT (to be implemented)
- **Payments**: Stripe (to be implemented)

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   Edit `.env` file with your Neon database URL and Stripe keys

3. **Push database schema**:
   ```bash
   npm run db:push
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5001`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:studio` - Open Drizzle Studio

## Routes

### Public Routes
- `/` - Home page
- `/menu` - Product catalog
- `/product/:id` - Product detail
- `/about` - About page
- `/login` - Login page

### Customer Routes (Authenticated)
- `/dashboard` - Customer dashboard
- `/orders` - Order history
- `/subscriptions` - Manage subscriptions

### Admin Routes (Admin only)
- `/admin/dashboard` - Admin dashboard
- `/admin/products` - Manage products
- `/admin/orders` - Manage orders

## Next Steps

This is a minimal working skeleton. To complete the conversion:

1. **Copy UI Components**: Import shadcn/ui components from the Next.js version
2. **Implement Authentication**: Add bcrypt password hashing and JWT middleware
3. **Add Stripe Integration**: Implement payment processing
4. **Complete API Routes**: Add all CRUD operations for orders, subscriptions, etc.
5. **Add More Pages**: Checkout, order history, subscription management, etc.
6. **Implement Middleware**: Auth guards for protected routes
7. **Add State Management**: Zustand stores for cart, user, etc.
8. **Testing**: Add Vitest tests and Playwright e2e tests

## Database Schema

The database includes tables for:
- Users (customers, admins, delivery)
- Products & Product Sizes
- Orders & Order Items
- Subscriptions
- Addresses
- Glass Bottle Inventory
- Deliveries
- Sessions (auth tokens)

See `db/schema.ts` for full schema definition.

## Development Notes

- Frontend runs on port 5001 (served by Express in dev mode via Vite middleware)
- API routes are prefixed with `/api`
- Database connection uses Neon serverless PostgreSQL
- All shared types are in `shared/types.ts`
