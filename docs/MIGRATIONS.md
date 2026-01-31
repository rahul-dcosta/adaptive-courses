# Database Migrations

Run these SQL commands in Supabase SQL Editor in order.

## Migration 1: Courses Table

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

-- Allow anonymous course creation (for MVP without auth)
create policy "Allow anonymous course creation"
  on courses for insert
  with check (true);

-- Allow anonymous reads (for MVP)
create policy "Allow anonymous reads"
  on courses for select
  using (true);
```

## Migration 2: Email Signups Table

```sql
create table email_signups (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  source text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table email_signups enable row level security;

-- Allow inserts (signups)
create policy "Allow email signups"
  on email_signups for insert
  with check (true);

-- Create index for faster email lookups
create index email_signups_email_idx on email_signups(email);
```

## Migration 3: Course Generations Log (Optional - for analytics)

```sql
create table course_generations (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references courses(id),
  topic text not null,
  situation text,
  timeline text,
  goal text,
  generation_time_ms integer,
  tokens_used integer,
  cost_usd numeric(10, 4),
  success boolean default true,
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table course_generations enable row level security;

create policy "Allow course generation logging"
  on course_generations for insert
  with check (true);
```

---

## Verification

After running migrations, verify with:

```sql
-- List all tables
select table_name from information_schema.tables 
where table_schema = 'public';

-- Check courses table structure
select column_name, data_type from information_schema.columns
where table_name = 'courses';

-- Check email_signups table
select * from email_signups limit 5;

-- Check RLS policies
select tablename, policyname from pg_policies;
```
