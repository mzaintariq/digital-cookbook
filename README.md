# Recipe Vault — MVP v0.1

A private, family recipe vault that stores only tried & approved recipes.

## Features

- ✅ Browse approved recipes on the public homepage
- ✅ View detailed recipe pages with ingredients, steps, and notes
- ✅ Admin authentication (single admin user)
- ✅ Admin recipe management (create, edit, delete, approve/unapprove)
- ✅ Clean, mobile-first UI with Tailwind CSS

## Tech Stack

- **Frontend + Backend**: Nuxt 3 (Vue 3, Composition API)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS

## Setup

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or hosted on Neon/Supabase)
- npm, pnpm, yarn, or bun

### Installation

1. **Clone the repository and install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/cookbook_db"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD_HASH="your_bcrypt_hashed_password"
JWT_SECRET="your-secret-key-change-in-production"
```

**To generate a password hash:**
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your-password', 10).then(hash => console.log(hash))"
```

3. **Set up the database:**

```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Seed the database with sample recipes
npm run seed
```

4. **Start the development server:**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Routes

### Public Routes

- `/` - Recipe list (only approved recipes)
- `/recipes/[slug]` - Recipe detail page

### Admin Routes (requires authentication)

- `/admin/login` - Admin login page
- `/admin/recipes` - Recipe management table
- `/admin/recipes/new` - Create new recipe
- `/admin/recipes/[id]/edit` - Edit recipe

## Database Schema

The `Recipe` model includes:
- `id` (UUID)
- `title` (string)
- `slug` (string, unique)
- `ingredients` (string[])
- `steps` (string[])
- `cookTimeMinutes` (number)
- `spiceLevel` (number, 1-5)
- `tags` (string[])
- `notes` (string | null)
- `rating` (number, 1-5)
- `approvedBy` (string)
- `status` ("draft" | "approved")
- `createdAt`, `updatedAt` (DateTime)

## Seed Data

The seed script includes two sample recipes:
- **Chicken Karahi** (approved)
- **Daal Chawal** (approved)

Run `npm run seed` to populate the database.

## Production Deployment

### Vercel

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Database

Use Neon or Supabase for PostgreSQL hosting:
- Set `DATABASE_URL` to your hosted database connection string
- Run migrations: `npx prisma migrate deploy`

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed database
npm run seed
```

## Notes

- Only approved recipes appear on public pages
- Admin authentication uses JWT tokens stored in HTTP-only cookies
- Slug must be unique across all recipes
- Ingredients and steps are stored as arrays (split by newline in forms)
