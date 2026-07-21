# InzuLink Rwanda

Rwanda's premium property rental platform connecting landlords directly with tenants. No brokers, no commissions.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI**: Radix UI Primitives + shadcn/ui patterns
- **Animations**: Framer Motion
- **ORM**: Prisma (PostgreSQL)
- **State**: Zustand (client), Context API (auth/locale)
- **Auth**: JWT with bcrypt
- **i18n**: 4 languages (English, Kinyarwanda, French, Kiswahili)
- **Toasts**: Sonner
- **Icons**: Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your database URL and JWT secret

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Seed Data

The seed script creates:
- 1 admin user (admin@inzulink.rw / admin123)
- 12 landlord users (e.g. jean@inzulink.rw / landlord123)
- 12 properties across Rwanda
- 4 reviews

## Project Structure

```
src/
  app/          # Pages and API routes
  components/   # UI, layout, landing, property components
  lib/          # Utilities, auth, prisma client, constants
  providers/    # Auth, theme, locale providers
  store/        # Zustand stores (favorites, compare)
  types/        # TypeScript type definitions
  i18n/         # Translations (en, rw, fr, sw)
```

## Features

- Property search with advanced filters
- AI-powered natural language search
- Landlord dashboard with property management
- Admin dashboard for property approval
- Favorites and property comparison
- Direct messaging between tenants and landlords
- Multi-language support
- Dark mode
- Responsive design

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema to database
- `npx prisma db seed` - Seed the database
- `npx prisma studio` - Open Prisma Studio
