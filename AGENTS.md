# InzuLink Rwanda - Development Guide

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Radix UI Primitives + shadcn/ui patterns
- Framer Motion (animations)
- Prisma (ORM)
- PostgreSQL (Database)
- Zustand (client state)
- Sonner (toasts)
- Lucide Icons
- Next Themes (dark mode)

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema to database
- `npx prisma studio` - Open Prisma Studio

## Project Structure
```
src/
├── app/
│   ├── (auth)/         # Login, Register, Verify, Forgot Password
│   ├── (dashboard)/    # Favorites, Compare, Chat, Notifications
│   │   └── dashboard/  # Landlord & Admin dashboards
│   ├── (marketing)/    # About, Contact, Help, Privacy, Terms, Blog
│   ├── property/[id]/  # Property detail page
│   ├── search/         # Property search with filters
│   ├── ai-search/      # AI-powered natural language search
│   └── api/            # API routes
├── components/
│   ├── ui/             # Core UI components (button, card, input, etc.)
│   ├── layout/         # Navbar, Footer
│   ├── landing/        # Landing page sections
│   ├── property/       # PropertyCard, etc.
│   ├── search/         # Search filters, maps
│   └── dashboard/      # Dashboard-specific components
├── lib/                # Utilities, constants, prisma client
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── store/              # Zustand state stores
├── providers/          # React context providers
├── i18n/               # Internationalization (en, rw, fr, sw)
└── config/             # App configuration
```

## Design System
- **Primary**: Emerald green (#059669 / hsl(160, 84%, 39%))
- **Accent**: Warm gold (#f59e0b / hsl(43, 96%, 56%))
- **Background**: White / Dark charcoal
- **Border radius**: 0.75rem (rounded-2xl default)
- **Font**: Inter (via next/font)
- **Shadows**: Soft, multi-layered shadows
- **Glassmorphism**: backdrop-blur-xl with subtle borders

## Conventions
- Use `cn()` utility for className merging
- All UI components in `src/components/ui/`
- Client components marked with "use client"
- Framer Motion for all animations
- Lucide icons for all iconography
- CSS variables for theming (light/dark)
- Semantic HTML with proper ARIA labels
- Mobile-first responsive design

## Naming
- Components: PascalCase
- Utilities: camelCase
- Types: PascalCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case

## Color Palette (Rwanda-inspired)
- Deep Green: emerald-600 to teal-500
- Warm Gold: amber-500 to yellow-500
- Clean White: background
- Charcoal: foreground
- Earth tones for accents