-- Core tables for auto export MVP

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  name_i18n jsonb not null,
  description_i18n jsonb,
  category text,
  specifications jsonb,
  price_range_min numeric(12,2),
  price_range_max numeric(12,2),
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists public.vehicle_images (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references public.vehicles(id) on delete cascade,
  url text not null,
  display_order int,
  is_cover boolean default false
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references public.vehicles(id) on delete cascade,
  title_i18n jsonb not null,
  certificate_number text,
  pdf_url text,
  issue_date date,
  expiry_date date
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title_i18n jsonb not null,
  category text,
  file_url text not null,
  file_size int,
  created_at timestamptz default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title_i18n jsonb not null,
  description_i18n jsonb,
  location text,
  employment_type text,
  requirements_i18n jsonb,
  status text default 'open',
  created_at timestamptz default now()
);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id) on delete cascade,
  applicant_name text not null,
  email text not null,
  phone text,
  resume_url text,
  cover_letter_i18n jsonb,
  status text default 'new',
  applied_at timestamptz default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references public.vehicles(id) on delete set null,
  company_name text,
  contact_name text,
  email text not null,
  phone text,
  country text,
  message_i18n jsonb,
  quantity int,
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text default 'admin',
  last_login timestamptz
);

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title_i18n jsonb not null,
  content_i18n jsonb not null,
  excerpt_i18n jsonb,
  slug text unique not null,
  category text,
  author text,
  cover_image text,
  published_at timestamptz,
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists idx_vehicle_category on public.vehicles(category);
create index if not exists idx_vehicle_status on public.vehicles(status);
create index if not exists idx_cert_vehicle on public.certificates(vehicle_id);
create index if not exists idx_doc_category on public.documents(category);
create index if not exists idx_job_status on public.jobs(status);
create index if not exists idx_inquiry_status on public.inquiries(status);
create index if not exists idx_inquiry_vehicle on public.inquiries(vehicle_id);
create index if not exists idx_blog_category on public.blogs(category);
create index if not exists idx_blog_slug on public.blogs(slug);
create index if not exists idx_blog_status on public.blogs(status);

-- RLS (example policies: public read, admin write)
alter table public.vehicles enable row level security;
alter table public.vehicle_images enable row level security;
alter table public.certificates enable row level security;
alter table public.documents enable row level security;
alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;
alter table public.inquiries enable row level security;
alter table public.users enable row level security;
alter table public.blogs enable row level security;

create policy if not exists "public_select_vehicles" on public.vehicles for select using (true);
create policy if not exists "public_select_vehicle_images" on public.vehicle_images for select using (true);
create policy if not exists "public_select_certificates" on public.certificates for select using (true);
create policy if not exists "public_select_documents" on public.documents for select using (true);
create policy if not exists "public_select_jobs" on public.jobs for select using (true);
create policy if not exists "public_select_blogs" on public.blogs for select using (status = 'published');

create policy if not exists "admin_write_vehicles" on public.vehicles for all using (auth.jwt()->>'role' = 'admin');
create policy if not exists "admin_write_vehicle_images" on public.vehicle_images for all using (auth.jwt()->>'role' = 'admin');
create policy if not exists "admin_write_certificates" on public.certificates for all using (auth.jwt()->>'role' = 'admin');
create policy if not exists "admin_write_documents" on public.documents for all using (auth.jwt()->>'role' = 'admin');
create policy if not exists "admin_write_jobs" on public.jobs for all using (auth.jwt()->>'role' = 'admin');
create policy if not exists "admin_write_job_applications" on public.job_applications for all using (auth.jwt()->>'role' = 'admin');
create policy if not exists "admin_write_inquiries" on public.inquiries for all using (auth.jwt()->>'role' = 'admin');
create policy if not exists "admin_write_users" on public.users for all using (auth.jwt()->>'role' = 'admin');
create policy if not exists "admin_write_blogs" on public.blogs for all using (auth.jwt()->>'role' = 'admin');
