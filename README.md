# ToDoTrade - Trading Journal & Performance Tracker

A comprehensive trading journal and performance tracking platform for Crypto Futures and Stock traders.

## Features

### Core Features (MVP)
- **Authentication**: Email/Password for users, Google OAuth for admins
- **Dashboard**: Real-time trading performance metrics and analytics
- **Trading Journal**: Document every trade with screenshots, notes, and tags
- **Backtest Center**: Test and validate trading strategies with historical data
- **Trading Signals**: Track and share trading signals with performance history
- **Portfolio Tracker**: Monitor asset holdings and portfolio performance
- **Strategy Vault**: Store and organize trading strategy SOPs
- **Playbook**: Pre and post-trade evaluation checklists
- **Analytics**: Performance analysis by pair, setup, and time period

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: Drizzle ORM
- **Authentication**: Auth.js v5 (NextAuth)
- **UI**: Shadcn UI + Tailwind CSS
- **File Storage**: Cloudinary
- **Charts**: Recharts
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Neon PostgreSQL database account
- A Cloudinary account for image uploads
- (Optional) Google OAuth credentials for admin login

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todotrade
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=your_neon_database_url_here

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_here_generate_with_openssl

# Google OAuth (Admin Only)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Admin Emails (comma separated)
ADMIN_EMAILS=admin@example.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

4. Generate NextAuth secret:
```bash
openssl rand -base64 32
```

5. Push database schema:
```bash
npm run db:push
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Management

### Push schema changes:
```bash
npm run db:push
```

### Generate migrations:
```bash
npm run db:generate
```

### Run migrations:
```bash
npm run db:migrate
```

### Open Drizzle Studio (Database GUI):
```bash
npm run db:studio
```

## Project Structure

```
todotrade/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── dashboard/
│   │   ├── journal/
│   │   ├── backtest/
│   │   ├── signals/
│   │   ├── portfolio/
│   │   ├── strategy-vault/
│   │   ├── playbook/
│   │   └── analytics/
│   ├── api/
│   │   └── auth/[...nextauth]/
│   └── layout.tsx
├── lib/
│   ├── db/
│   │   ├── schema.ts        # Database schema
│   │   ├── index.ts         # Database client
│   │   └── migrations/      # Migration files
│   ├── actions/             # Server actions
│   ├── auth.ts              # Auth configuration
│   └── utils.ts             # Utility functions
├── components/
│   └── ui/                  # Shadcn UI components
├── types/
│   └── next-auth.d.ts       # NextAuth type definitions
└── middleware.ts            # Route protection
```

## Authentication

### User Registration
- Users register with email and password
- Passwords are hashed with bcryptjs
- Default role: "user"

### User Login
- Email and password authentication
- JWT-based sessions
- Automatic redirect to dashboard

### Admin Login
- Google OAuth only
- Email must be in ADMIN_EMAILS environment variable
- Automatic admin role assignment

## Database Schema

The application uses the following main tables:
- `users` - User accounts and profiles
- `trades` - Trading journal entries
- `tags` - Trade tags (breakout, retest, etc.)
- `trade_tags` - Many-to-many relation between trades and tags
- `backtest_strategies` - Backtest strategy definitions
- `backtest_trades` - Individual backtest samples
- `signals` - Trading signals before and after tracking
- `portfolio_assets` - Portfolio holdings
- `strategies` - Strategy vault entries
- `playbook_entries` - Pre/post trade checklists

## Development

### Adding New Features
1. Define database schema in `lib/db/schema.ts`
2. Create server actions in `lib/actions/`
3. Build UI components in `app/(dashboard)/`
4. Update navigation in `app/(dashboard)/layout.tsx`

### Code Style
- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for formatting (if configured)
- Follow Next.js 15 App Router conventions

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables Checklist
- [ ] DATABASE_URL
- [ ] NEXTAUTH_URL
- [ ] NEXTAUTH_SECRET
- [ ] GOOGLE_CLIENT_ID (optional)
- [ ] GOOGLE_CLIENT_SECRET (optional)
- [ ] ADMIN_EMAILS
- [ ] CLOUDINARY_CLOUD_NAME
- [ ] CLOUDINARY_API_KEY
- [ ] CLOUDINARY_API_SECRET
- [ ] NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

## Roadmap

### Future Features
- [ ] AI Trading Coach - Automated journal analysis
- [ ] Auto Import - Binance, Bybit, OKX integration
- [ ] TradingView Integration
- [ ] Mobile App
- [ ] Real-time Notifications
- [ ] Team/Community Features
- [ ] Advanced Analytics & Reports

## Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review PRD.md for detailed requirements

## License

[Your License Here]

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.