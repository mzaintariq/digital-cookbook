# Recipe Vault — MVP v1

A private, family recipe vault that stores only tried & published recipes.

## Features

- ✅ Browse published recipes on the public homepage
- ✅ View detailed recipe pages with ingredients, steps (with categories/sub-steps), and notes
- ✅ Admin authentication (single admin user)
- ✅ Admin recipe management (create, edit, delete, publish/unpublish)
- ✅ Structured ingredients & steps with categories; drag-and-drop reorder in admin (within and between categories)
- ✅ Clean, desktop + mobile UI with Tailwind CSS

## Tech Stack

- **Frontend + Backend**: Nuxt 4 (Vue 3, Composition API)
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
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="your_bcrypt_hashed_password"
JWT_SECRET="replace-with-a-long-random-secret"
```

**To generate a password hash:**
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your-password', 10).then(hash => console.log(hash))"
```

`JWT_SECRET` is required. Use a long random value of at least 32 characters:

```bash
openssl rand -base64 32
```

3. **Set up the database:**

```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
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
- `/admin/recipes/[id]` - Edit recipe (same page as new when `id` is a recipe UUID)

## Database Schema

The `Recipe` model includes:
- `id` (UUID)
- `title` (string)
- `slug` (string, unique)
- `description` (string | null)
- `ingredients` (JSON — array of objects: quantity, unit, name, category, etc.)
- `steps` (JSON — array of objects: description, category, subSteps)
- `cookTimeMinutes` (number)
- `prepTimeMinutes`, `restTimeMinutes` (number | null)
- `servings` (number | null)
- `tags` (string[])
- `notes` (string | null)
- `credit`, `videoUrl` (string | null)
- `approvedBy` (string)
- `status` ("draft" | "publish")
- `createdAt`, `updatedAt` (DateTime)

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
```

## Notes

- Only published recipes appear on public pages
- Admin authentication uses JWT tokens stored in HTTP-only cookies
- Slug must be unique across all recipes
- Ingredients and steps are stored as JSON (structured objects with categories, sub-steps, etc.); admin form supports drag-and-drop reordering within and between categories
