
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: subjects
create table public.subjects (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  name text NOT NULL,
  description text,
  icon text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: tests
create table public.tests (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title text NOT NULL,
  duration integer DEFAULT 10 NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: questions
create table public.questions (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  test_id uuid NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  text text NOT NULL,
  options jsonb DEFAULT '[]'::jsonb NOT NULL,
  correct_index integer NOT NULL CHECK (correct_index >= 0 AND correct_index <= 3),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: test_results
create table public.test_results (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  student_name text NOT NULL,
  test_id uuid REFERENCES public.tests(id) ON DELETE SET NULL,
  score integer NOT NULL, -- Percentage
  total_questions integer NOT NULL,
  correct_answers integer NOT NULL,
  completed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Allow public read access (for students taking tests)
alter table public.subjects enable row level security;
alter table public.tests enable row level security;
alter table public.questions enable row level security;
alter table public.test_results enable row level security;


-- Policies for public access (Simplified for this project)

-- Allow anyone to read subjects, tests, and questions
create policy "Allow public read access for subjects" on public.subjects for select using (true);
create policy "Allow public read access for tests" on public.tests for select using (true);
create policy "Allow public read access for questions" on public.questions for select using (true);

-- Allow anyone to create test results (students submitting tests)
create policy "Allow public insert access for test results" on public.test_results for insert with check (true);
-- Allow reading test results (for admin dashboard - in real app, restrict this)
create policy "Allow public read access for test results" on public.test_results for select using (true);

-- Allow admin operations (In a real app, use auth only. Here we allow public insert/update/delete for the admin panel to work without auth for now)
create policy "Allow public insert for subjects" on public.subjects for insert with check (true);
create policy "Allow public update for subjects" on public.subjects for update using (true);
create policy "Allow public delete for subjects" on public.subjects for delete using (true);

create policy "Allow public insert for tests" on public.tests for insert with check (true);
create policy "Allow public update for tests" on public.tests for update using (true);
create policy "Allow public delete for tests" on public.tests for delete using (true);

create policy "Allow public insert for questions" on public.questions for insert with check (true);
create policy "Allow public update for questions" on public.questions for update using (true);
create policy "Allow public delete for questions" on public.questions for delete using (true);
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
