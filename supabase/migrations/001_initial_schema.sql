-- Smile Fotilo initial platform schema
-- Safe to run manually in Supabase SQL editor.

create extension if not exists pgcrypto;

-- Profiles (extend auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  phone text,
  role text check (role in ('admin', 'client', 'agent_creator')) default 'client',
  company_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  category text check (category in ('clinic', 'restaurant', 'retail', 'real_estate', 'education', 'other')),
  phone text not null,
  whatsapp_number text,
  email text,
  address text,
  city text,
  state text,
  language_preference text default 'hi-EN',
  timezone text default 'Asia/Kolkata',
  subscription_tier text default 'starter',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  name text not null,
  type text check (type in ('receptionist', 'followup', 'review_manager', 'content_creator', 'custom')) default 'receptionist',
  configuration jsonb default '{}'::jsonb,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  title text not null,
  content text not null,
  document_type text default 'faq',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.agents(id) on delete set null,
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_phone text not null,
  customer_name text,
  source text default 'website',
  status text default 'active',
  ai_handled boolean default true,
  metadata jsonb default '{}'::jsonb,
  last_message_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_type text check (sender_type in ('customer', 'ai', 'human', 'system')) not null,
  content text not null,
  media_urls text[],
  ai_confidence float,
  requires_human boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.missed_calls (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  caller_number text not null,
  caller_name text,
  call_time timestamptz not null,
  call_duration integer default 0,
  recovery_status text default 'pending',
  recovery_message text,
  recovery_sent_at timestamptz,
  customer_response text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  appointment_date date not null,
  appointment_time time not null,
  service_type text,
  status text default 'pending',
  reminder_sent_24h boolean default false,
  reminder_sent_2h boolean default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.video_content (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  title text not null,
  prompt text not null,
  status text default 'pending',
  video_url text,
  thumbnail_url text,
  scheduled_for timestamptz,
  posted_to_gmb boolean default false,
  posted_to_instagram boolean default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.agent_templates (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.profiles(id) on delete set null,
  name text not null,
  slug text unique not null,
  description text not null,
  short_description text,
  category text default 'other',
  icon_url text,
  cover_image_url text,
  configuration jsonb not null default '{}'::jsonb,
  knowledge_base_template jsonb default '[]'::jsonb,
  price_inr integer default 0,
  status text default 'draft',
  is_featured boolean default false,
  downloads_count integer default 0,
  rating_average float default 0,
  rating_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.marketplace_purchases (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references public.profiles(id) on delete cascade,
  template_id uuid references public.agent_templates(id) on delete cascade,
  amount_paid integer not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  plan_name text not null,
  amount_inr integer not null,
  billing_cycle text default 'monthly',
  razorpay_subscription_id text,
  status text default 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- Performance indexes
create index if not exists idx_business_owner on public.businesses(owner_id);
create index if not exists idx_agents_business on public.agents(business_id);
create index if not exists idx_conversations_business on public.conversations(business_id);
create index if not exists idx_messages_conversation on public.messages(conversation_id);
create index if not exists idx_missed_calls_business on public.missed_calls(business_id);
create index if not exists idx_appointments_business on public.appointments(business_id);
create index if not exists idx_agent_templates_status on public.agent_templates(status);

-- RLS
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.agents enable row level security;
alter table public.knowledge_documents enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.missed_calls enable row level security;
alter table public.appointments enable row level security;
alter table public.video_content enable row level security;
alter table public.agent_templates enable row level security;
alter table public.marketplace_purchases enable row level security;
alter table public.subscriptions enable row level security;

-- Policies (idempotent)
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

drop policy if exists "Business owners can manage businesses" on public.businesses;
create policy "Business owners can manage businesses"
  on public.businesses for all using (auth.uid() = owner_id);

drop policy if exists "Business owners can manage agents" on public.agents;
create policy "Business owners can manage agents"
  on public.agents for all using (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  );

drop policy if exists "Business owners can manage knowledge docs" on public.knowledge_documents;
create policy "Business owners can manage knowledge docs"
  on public.knowledge_documents for all using (
    agent_id in (
      select a.id from public.agents a
      join public.businesses b on b.id = a.business_id
      where b.owner_id = auth.uid()
    )
  );

drop policy if exists "Business owners can manage conversations" on public.conversations;
create policy "Business owners can manage conversations"
  on public.conversations for all using (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  );

drop policy if exists "Business owners can manage messages" on public.messages;
create policy "Business owners can manage messages"
  on public.messages for all using (
    conversation_id in (
      select c.id from public.conversations c
      join public.businesses b on b.id = c.business_id
      where b.owner_id = auth.uid()
    )
  );

drop policy if exists "Business owners can manage missed calls" on public.missed_calls;
create policy "Business owners can manage missed calls"
  on public.missed_calls for all using (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  );

drop policy if exists "Business owners can manage appointments" on public.appointments;
create policy "Business owners can manage appointments"
  on public.appointments for all using (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  );

drop policy if exists "Business owners can manage video content" on public.video_content;
create policy "Business owners can manage video content"
  on public.video_content for all using (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  );

drop policy if exists "Templates visible when published" on public.agent_templates;
create policy "Templates visible when published"
  on public.agent_templates for select using (status = 'published' or creator_id = auth.uid());

drop policy if exists "Creators manage templates" on public.agent_templates;
create policy "Creators manage templates"
  on public.agent_templates for all using (creator_id = auth.uid());

drop policy if exists "Users manage own purchases" on public.marketplace_purchases;
create policy "Users manage own purchases"
  on public.marketplace_purchases for all using (buyer_id = auth.uid());

drop policy if exists "Business owners manage subscriptions" on public.subscriptions;
create policy "Business owners manage subscriptions"
  on public.subscriptions for all using (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  );

