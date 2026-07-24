# Vercel Deployment Guide

## Quick Start

### Step 1: Set up Database

1. Create a PostgreSQL database on [Neon](https://neon.tech) or [Supabase](https://supabase.com)
2. Copy your database connection string (it will look like: `postgresql://user:password@host:5432/database`)

### Step 2: Prepare Environment Variables

Before deploying, you'll need to generate:

**1. Admin Password Hash:**
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your-password', 10).then(hash => console.log(hash))"
```

**2. JWT Secret:**
```bash
openssl rand -base64 32
```

### Step 3: Deploy to Vercel

1. **Push your code to GitHub/GitLab**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your repository
   - Vercel will auto-detect Nuxt 4 (uses `vercel.json`)

3. **Set Environment Variables:**
   In the Vercel project settings, add these environment variables:
   
   - `DATABASE_URL` - Your PostgreSQL connection string from Neon/Supabase
   - `ADMIN_USERNAME` - Your admin username
   - `ADMIN_PASSWORD_HASH` - The bcrypt hash you generated
   - `JWT_SECRET` - Required; use the long random secret you generated (at least 32 characters recommended)
   - `SUPABASE_URL` - From Supabase **Project Settings → API** (Project URL)
   - `SUPABASE_SERVICE_ROLE_KEY` - From the same page (service_role secret; used only on the server for uploads)
   
   **Recipe images:** In the Supabase project, open **Storage**, create a **public** bucket named `recipe-images`. Without this bucket and the two Supabase env vars, recipe image upload is disabled.

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete

### Step 4: Run Database Migrations

After deployment, you need to run migrations on your production database:

```bash
# Set your production database URL
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy
npx prisma generate
```

Alternatively, you can run this locally by temporarily setting `DATABASE_URL` to your production database URL.

### Step 5: Verify Deployment

1. Visit your deployed site
2. Test admin login at `/admin/login`
3. Create a test recipe
4. Verify public recipe pages work

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `ADMIN_USERNAME` | Admin login username | `admin` |
| `ADMIN_PASSWORD_HASH` | Bcrypt hashed password | `$2b$10$...` |
| `JWT_SECRET` | Secret for JWT tokens (32+ chars) | Random base64 string |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) | From API settings |

**Supabase Storage:** Create a public bucket `recipe-images` in the Supabase dashboard. The app uploads to paths `{recipeId}/{uuid}.{ext}` inside that bucket.

## Troubleshooting

### Build Fails
- Ensure all dependencies are in `package.json`
- Check that `npm run build` works locally
- Review build logs in Vercel dashboard

### Database Connection Errors
- Verify `DATABASE_URL` is correct
- Ensure database allows connections from Vercel IPs
- Check if database requires SSL (add `?sslmode=require` to connection string)

### Admin Login Not Working
- Verify `ADMIN_PASSWORD_HASH` matches the password you're using
- Check that `JWT_SECRET` is set correctly
- Ensure cookies are enabled in your browser

## Next Steps

- Set up a custom domain in Vercel settings
- Configure automatic deployments from your main branch
- Set up database backups on your PostgreSQL provider
