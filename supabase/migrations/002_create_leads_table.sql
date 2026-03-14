-- Create leads table for contact form and chatbot inquiries
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references public.businesses(id) on delete cascade,
  source text not null, -- 'contact_form' or 'chatbot'
  name text,
  email text,
  phone text,
  service text,
  budget text,
  message text,
  conversation_summary text,
  status text default 'new', -- 'new', 'contacted', 'converted', 'lost'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.leads enable row level security;

-- Policies for leads
create policy "Users can view leads for their businesses"
  on public.leads for select
  using (
    exists (
      select 1 from public.businesses
      where businesses.id = leads.business_id
      and businesses.owner_id = auth.uid()
    )
  );

create policy "Users can insert leads for their businesses"
  on public.leads for insert
  with check (
    exists (
      select 1 from public.businesses
      where businesses.id = leads.business_id
      and businesses.owner_id = auth.uid()
    )
  );

-- Service role bypasses RLS
create policy "Service role has full access to leads"
  on public.leads for all
  using (true)
  with check (true);
