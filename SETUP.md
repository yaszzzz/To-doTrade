# AxellTrade Setup Guide

This guide will walk you through setting up ToDoTrade from scratch.

## Prerequisites

Before you begin, make sure you have:

- [Node.js 18+](https://nodejs.org/) installed
- [Git](https://git-scm.com/) installed
- A [Neon](https://neon.tech/) account for PostgreSQL database
- A [Cloudinary](https://cloudinary.com/) account for image storage
- (Optional) [Google Cloud Console](https://console.cloud.google.com/) for OAuth

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd axelltrade

# Install dependencies
npm install
```

### 2. Database Setup (Neon PostgreSQL)

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string (it looks like: `postgresql://user:password@host/database?sslmode=require`)
4. Save it for the next step

### 3. Cloudinary Setup

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Note your Cloud Name, API Key, and API Secret
3. Save these for the next step

### 4. Google OAuth Setup (Optional - Admin Only)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth client ID
5. Application type: Web application
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret

### 5. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database (from Step 2)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_this_with_command_below

# Google OAuth (from Step 4 - Optional)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Admin Emails (comma separated)
ADMIN_EMAILS=admin@example.com,admin2@example.com

# Cloudinary (from Step 3)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

Or use online generator: https://generate-secret.vercel.app/32

### 6. Initialize Database

Push the schema to your Neon database:

```bash
npm run db:push
```

This will create all the necessary tables in your database.

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 8. Create Your First User

1. Navigate to [http://localhost:3000](http://localhost:3000)
2. You'll be redirected to `/login`
3. Click "Sign up" to create an account
4. Fill in your details:
   - Full Name
   - Email
   - Password (minimum 8 characters)
5. Click "Sign Up"
6. You'll be redirected to login
7. Sign in with your credentials

### 9. Test Admin Access (Optional)

If you set up Google OAuth:

1. Add your Google email to `ADMIN_EMAILS` in `.env.local`
2. Restart the dev server
3. On the login page, click "Admin Login with Google"
4. Sign in with your Google account
5. You'll be logged in with admin role

## Verification Checklist

- [ ] Dependencies installed successfully
- [ ] `.env.local` file created with all variables
- [ ] Database schema pushed to Neon
- [ ] Development server runs without errors
- [ ] Can register a new user account
- [ ] Can login with credentials
- [ ] Dashboard loads after login
- [ ] Can logout successfully
- [ ] (Optional) Admin Google login works

## Database Management

### View Database (Drizzle Studio)

```bash
npm run db:studio
```

This opens a GUI at `https://local.drizzle.studio` where you can:
- View all tables
- Add/edit/delete records
- Run queries
- Explore relationships

### Generate Migrations

When you modify `lib/db/schema.ts`:

```bash
npm run db:generate
```

This creates migration files in `lib/db/migrations/`

### Apply Migrations

```bash
npm run db:migrate
```

Or use push for development (overwrites schema):

```bash
npm run db:push
```

## Troubleshooting

### Database Connection Issues

**Problem**: `Error: getaddrinfo ENOTFOUND`

**Solution**: 
- Check DATABASE_URL is correct
- Ensure Neon project is not paused
- Verify network connectivity

### Authentication Issues

**Problem**: "Invalid email or password"

**Solution**:
- Verify user exists in database
- Check password was correctly entered during registration
- Try creating a new account

### Google OAuth Issues

**Problem**: "Access blocked: This app's request is invalid"

**Solution**:
- Verify redirect URIs in Google Console match your app
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Ensure email is in ADMIN_EMAILS

### Port Already in Use

**Problem**: `Error: Port 3000 is already in use`

**Solution**:
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

## Development Tips

### Hot Reload

Next.js supports hot reloading. Changes to:
- React components → instant reload
- Server actions → reload on next request
- Database schema → requires `npm run db:push`

### TypeScript Errors

If you see TypeScript errors:
1. Restart VS Code TypeScript server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
2. Delete `.next` folder and restart dev server
3. Run `npm install` to ensure types are up to date

### Database Schema Changes

When modifying schema:
1. Update `lib/db/schema.ts`
2. Run `npm run db:push` (development)
3. Or `npm run db:generate` + `npm run db:migrate` (production)

## Next Steps

Once setup is complete:

1. **Explore the Dashboard**: Navigate through different sections
2. **Create Your First Trade**: Go to Journal → Add Trade
3. **Set Up a Backtest**: Go to Backtest Center → New Strategy
4. **Add a Signal**: Go to Trading Signals → New Signal
5. **Track Your Portfolio**: Go to Portfolio → Add Asset

## Production Deployment

See [README.md](./README.md) for production deployment instructions to Vercel.

## Support

If you encounter issues:
1. Check this guide
2. Review [README.md](./README.md)
3. Check [PRD.md](./PRD.md) for feature specifications
4. Create an issue in the repository

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [NextAuth.js Documentation](https://authjs.dev/)
- [Neon Documentation](https://neon.tech/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)