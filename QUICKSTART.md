# Garden District Juice - Quick Start Guide

## ✅ Your app is ready to run!

The minimal working skeleton is complete. Here's how to use it:

## Start the App

```bash
cd /Users/codexmetatron/Documents/websites/garden-district-juice
npm run dev
```

Visit: **http://localhost:5001**

## What's Working

✅ **Frontend Pages:**
- Home page with hero and featured products
- Menu/catalog page
- Product detail pages
- About page
- Login page
- Customer dashboard
- Admin dashboard

✅ **API Endpoints:**
- `GET /api/health` - Health check
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product
- `POST /api/auth/login` - Login (basic)
- `GET /api/orders` - Orders (placeholder)

✅ **Database:**
- Complete Drizzle ORM schema for e-commerce
- Neon PostgreSQL connection configured
- Ready for `npm run db:push`

✅ **Tech Stack:**
- React 18 + Vite 5
- Wouter for routing
- TanStack Query for data fetching
- Express backend
- Tailwind CSS
- TypeScript

## Test It

```bash
# Test API
curl http://localhost:5001/api/health

# Test products endpoint (will be empty until you seed data)
curl http://localhost:5001/api/products
```

## Next Steps to Complete

### 1. Seed Database (Optional - for testing)
```bash
npm run db:push  # Push schema to database
# Then manually insert test products via Drizzle Studio:
npm run db:studio
```

### 2. Copy Components from Next.js Version
The original Next.js app has many UI components in `src/components/`. Copy these to:
- `client/src/components/ui/` - shadcn/ui components
- `client/src/components/` - Custom components

### 3. Add Authentication
- Implement bcrypt password hashing in `/api/auth/login`
- Add JWT token generation
- Create auth middleware for protected routes
- Add auth context/hooks on frontend

### 4. Implement Stripe
- Copy Stripe integration from Next.js version
- Add `/api/stripe/*` routes
- Add checkout page and payment flow

### 5. Complete Features
- Shopping cart (Zustand store)
- Checkout flow
- Order management
- Subscription management
- Admin CRUD operations
- User profile/settings

### 6. Copy Remaining Pages
From Next.js `app/(customer)/` and `app/(admin)/`:
- Order history
- Subscription management
- Settings
- Admin product management
- Admin order management

## File Structure

```
garden-district-juice/
├── client/
│   ├── src/
│   │   ├── pages/         ✅ 8 pages created
│   │   ├── components/    📝 Copy from Next.js
│   │   ├── hooks/         📝 Copy from Next.js
│   │   ├── lib/           📝 Copy utils from Next.js
│   │   └── App.tsx        ✅ Router configured
│   └── index.html         ✅ Created
├── server/
│   ├── index.ts           ✅ Express server
│   ├── routes.ts          ✅ Basic API routes
│   └── vite.ts            ✅ Vite middleware
├── db/
│   ├── schema.ts          ✅ Complete schema
│   └── index.ts           ✅ DB connection
├── shared/
│   └── types.ts           ✅ Shared types
└── package.json           ✅ All dependencies
```

## Key Differences from Next.js

| Next.js | Vite Equivalent |
|---------|----------------|
| `app/page.tsx` | `client/src/pages/Home.tsx` |
| `app/menu/page.tsx` | `client/src/pages/Menu.tsx` |
| `useRouter()` from next | `useLocation()` from wouter |
| `<Link href>` from next | `<Link href>` from wouter |
| `app/api/route.ts` | `server/routes.ts` Express routes |
| `@/` imports | Still work via tsconfig paths |

## Port Configuration

This app runs on port **5001** (not 5000) to avoid conflicts with macOS AirPlay Receiver.

To change port: Edit `.env` and `server/index.ts`

## Tips

1. **Development**: Hot reload works for both client and server code
2. **Type Safety**: All shared types are in `shared/types.ts`
3. **Database**: Use Drizzle Studio (`npm run db:studio`) to view/edit data
4. **API Testing**: Use the health endpoint to verify server is running

## Need Help?

Check the full README.md for detailed documentation and schema information.
