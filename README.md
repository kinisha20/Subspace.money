# Subspace.money

**India's most premium AI-native subscription and finance management platform.**

> Track every subscription. Split every bill. Automate every saving goal. Built for how modern India actually thinks about money.

---

## What is Subspace.money?

Subspace solves a high-frequency, low-trust consumer finance problem: people subscribe to more services than they track, share costs informally with friends, and often lose clarity on who paid, who owes, and what renews next.

**Core features:**
- AI-powered subscription tracking and optimizer
- Smart savings goals that adapt to your income
- Group finance and bill splitting (no awkward texts)
- Investment portfolio tracking
- AI budget recommendations and spending predictions
- Automated bill management

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, ShadCN UI |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Prisma ORM |
| Auth | Clerk |
| Payments | Stripe |
| AI | OpenAI API |
| Charts | Recharts |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## Project Structure

```
Subspace.money/
├── index.html              # Pure HTML marketing landing page (open directly in browser)
├── app/                    # Next.js 14 frontend application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   │   ├── (auth)/   # Login, signup pages
│   │   │   ├── (dashboard)/ # All 14 dashboard pages
│   │   │   └── page.tsx   # Next.js landing page version
│   │   ├── components/    # Reusable components
│   │   │   ├── ui/       # ShadCN base components
│   │   │   ├── layout/   # Navbar, Sidebar, DashboardLayout
│   │   │   ├── landing/  # Landing page sections
│   │   │   └── dashboard/ # Dashboard widgets
│   │   └── lib/          # Utils, design tokens, API client
│   └── package.json
├── backend/               # Express.js REST API
│   ├── src/
│   │   ├── server.ts     # App entry point
│   │   ├── routes/       # API route handlers
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Auth, error handling
│   │   └── services/     # OpenAI, Stripe, notifications
│   ├── prisma/
│   │   └── schema.prisma # MongoDB schema
│   └── package.json
└── README.md
```

---

## Quick Start

### 1. Open the marketing page instantly (no setup needed)

Just open `index.html` in any browser. Works offline.

### 2. Run the full Next.js application

```bash
cd app
npm install
cp .env.example .env.local
# Fill in your API keys in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Run the backend API

```bash
cd backend
npm install
cp .env.example .env
# Fill in your API keys in .env
npx prisma generate
npm run dev
```

Backend runs on [http://localhost:4000](http://localhost:4000)

---

## Environment Variables

### Frontend (`app/.env.local`)

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

NEXT_PUBLIC_API_URL=http://localhost:4000/api

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Backend (`backend/.env`)

```env
PORT=4000
NODE_ENV=development

DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/subspace?retryWrites=true&w=majority"

CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

OPENAI_API_KEY=sk-...

FRONTEND_URL=http://localhost:3000
```

---

## API Endpoints

### Authentication
All protected routes require `Authorization: Bearer <clerk_jwt>` header.

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/me` | Get current user profile |
| PUT | `/api/users/me` | Update profile |
| DELETE | `/api/users/me` | Delete account |

### Subscriptions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/subscriptions` | List all subscriptions |
| POST | `/api/subscriptions` | Add subscription |
| PUT | `/api/subscriptions/:id` | Update subscription |
| DELETE | `/api/subscriptions/:id` | Remove subscription |
| GET | `/api/subscriptions/insights` | AI subscription insights |

### Transactions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions` | List transactions (paginated) |
| POST | `/api/transactions` | Add transaction |
| GET | `/api/transactions/analytics` | Spending analytics |

### Goals (Savings)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/goals` | List savings goals |
| POST | `/api/goals` | Create goal |
| PUT | `/api/goals/:id` | Update goal |
| POST | `/api/goals/:id/contribute` | Add contribution |

### Groups (Bill Splitting)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/groups` | List groups |
| POST | `/api/groups` | Create group |
| POST | `/api/groups/:id/invite` | Invite member |
| POST | `/api/groups/:id/settle` | Settle payment |

### AI Insights
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/ai/insights` | Get AI recommendations |
| GET | `/api/ai/budget` | AI budget recommendations |
| GET | `/api/ai/predict` | Spending predictions |
| POST | `/api/ai/chat` | AI assistant chat |

---

## Deployment

### Frontend → Vercel

```bash
cd app
npm run build    # Verify build passes
# Push to GitHub → Connect to Vercel → Deploy
```

Set all `NEXT_PUBLIC_*` env vars in Vercel dashboard.

### Backend → Railway

```bash
# Push backend/ to separate GitHub repo OR monorepo
# Connect to Railway → Set root directory to backend/
# Set all env vars in Railway dashboard
```

### Database → MongoDB Atlas

1. Create free M0 cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create database user
3. Whitelist Railway/Vercel IPs (or allow all: `0.0.0.0/0` for dev)
4. Copy connection string to `DATABASE_URL`
5. Run `npx prisma db push` to sync schema

---

## Design System

### Colors
| Token | Hex | Usage |
|---|---|---|
| Cream | `#F5EFE7` | Page background |
| Deep Teal | `#0F5F56` | Cards, primary |
| Accent Green | `#7CCF5C` | CTAs, highlights |
| Near Black | `#121212` | Headings |
| Soft Gray | `#6B6B6B` | Body text |

### Typography
- **Headings:** Instrument Serif (editorial weight)
- **UI:** Satoshi / General Sans (clean geometric)
- **Hero H1:** 72px, weight 700, tight leading

---

## Development Notes

- The app gracefully degrades to **rich mock data** when API keys are not set
- All dashboard pages are fully functional with mock data from `src/lib/mock-data.ts`
- Dark mode is system-preference-aware via Tailwind `dark:` classes
- Mobile-first, responsive at 768px and 480px breakpoints

---

## License

Private — All rights reserved. Subspace.money, 2026.
