-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: subjects
create table public.subjects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  icon text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: tests
create table public.tests (
  id uuid default uuid_generate_v4() primary key,
  subject_id uuid references public.subjects(id) on delete cascade not null,
  title text not null,
  duration integer not null default 10, -- Duration in minutes
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: questions
create table public.questions (
  id uuid default uuid_generate_v4() primary key,
  test_id uuid references public.tests(id) on delete cascade not null,
  text text not null,
  options jsonb not null default '[]'::jsonb, -- Store options as ["A", "B", "C", "D"]
  correct_index integer not null CHECK (correct_index >= 0 AND correct_index <= 3),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: test_results (Optional, for tracking history)
create table public.test_results (
  id uuid default uuid_generate_v4() primary key,
  student_name text not null,
  test_id uuid references public.tests(id) on delete set null,
  score integer not null,
  total_questions integer not null,
  correct_answers integer not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Allow public read access (for students taking tests)
alter table public.subjects enable row level security;
alter table public.tests enable row level security;
alter table public.questions enable row level security;
alter table public.test_results enable row level security;

-- Policies for public data (Read-only for anon, full access is restricted but for this demo let's allow all for simplicity or define strict rules)
-- Ideally, you'd secure this, but for a simple "no-login" app, we'll allow anon read. Writing usually requires admin.
-- For this simple implementation, let's open it up to anon users to insert results, and admins to manage content.
-- However, since there is no auth implemented in the app yet, we might need to rely on the service key or allow anon writes for now if we want to store results.
-- Let's create simple policies for anon access:

create policy "Allow public read access on subjects" on public.subjects for select using (true);
create policy "Allow public read access on tests" on public.tests for select using (true);
create policy "Allow public read access on questions" on public.questions for select using (true);
create policy "Allow public insert on test_results" on public.test_results for insert with check (true);
create policy "Allow public read on test_results" on public.test_results for select using (true);

-- For Admin operations (managing content), you would typically require authentication.
-- Since the current app has an "Admin" panel accessible via URL without login, we will allow anon to write for now to maintain functionality.
-- WARNING: This is not secure for production. Anyone can edit the database without auth.
create policy "Allow public access on subjects" on public.subjects for all using (true);
create policy "Allow public access on tests" on public.tests for all using (true);
create policy "Allow public access on questions" on public.questions for all using (true);
