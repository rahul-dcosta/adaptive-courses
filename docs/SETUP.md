# Setup Instructions

## Environment Variables

Create `app/.env.local` with your API keys:

```bash
cd app
cp .env.local.example .env.local
```

Then edit `.env.local` and add:

### 1. Supabase Setup
Go to https://supabase.com and create a new project.

Get your keys from Project Settings → API:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (keep this secret!)
```

### 2. Anthropic API
Go to https://console.anthropic.com and create an API key:
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 3. Stripe (for payments - add later)
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Database Schema

Run this SQL in Supabase SQL Editor to create the courses table:

```sql
create table courses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  topic text not null,
  skill_level text not null,
  goal text not null,
  time_available text not null,
  content jsonb not null,
  paid boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table courses enable row level security;

-- Allow users to read their own courses
create policy "Users can read own courses"
  on courses for select
  using (auth.uid() = user_id);

-- Allow users to create courses
create policy "Users can create courses"
  on courses for insert
  with check (auth.uid() = user_id);
```

## Running Locally

```bash
cd app
npm install
npm run dev
```

Visit http://localhost:3000

## Vercel Deployment

1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy!

---
**Note:** The `.env.local` file is gitignored. Never commit API keys to the repo.
