-- VURTUAL TUTORSHIP - SUPABASE DATABASE
-- Run this in Supabase SQL Editor after creating your project.

create table if not exists public.services (
  id bigint primary key,
  name text not null,
  description text default '',
  price numeric(10,2) not null default 0,
  image text default '',
  created_at timestamptz not null default now()
);

insert into public.services (id,name,description,price,image) values
(1,'Mathematics Tutoring','Clear explanations, practice and exam preparation.',150,'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=85'),
(2,'Science Tutoring','Build confidence with concepts, examples and revision.',150,'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=85'),
(3,'English & Literacy','Improve language, writing, comprehension and communication.',150,'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=900&q=85'),
(4,'Exam Preparation','Focused revision plans and test-ready practice.',180,'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=85'),
(5,'Homework Support','Structured help to understand and complete schoolwork.',120,'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=85'),
(6,'Study Skills','Learn planning, revision and study techniques that last.',130,'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=85')
on conflict (id) do nothing;

alter table public.services enable row level security;
create policy "Public can view services" on public.services for select using (true);
create policy "Authenticated admins can manage services" on public.services for all to authenticated using (true) with check (true);

-- STORAGE
-- Create a PUBLIC bucket named: site-assets
-- The JS uses this bucket for the admin logo upload.
-- For production, restrict insert/update/delete to authenticated admins.

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin'
);

alter table public.admin_profiles enable row level security;
create policy "Admins can view own profile" on public.admin_profiles for select to authenticated using (auth.uid() = user_id);
