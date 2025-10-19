-- =============================================================
-- Migration Script: Fix Database Schema Issues
-- Apply this to your Supabase database to fix the missing tables and relationships
-- =============================================================

-- 1. Create referrals table if it doesn't exist
create table if not exists public.referrals (
  id bigserial primary key,
  referrer_id uuid references profiles(id) on delete cascade,
  referred_id uuid references profiles(id) on delete cascade,
  referral_code text not null,
  created_at timestamptz default now(),
  bonus_paid boolean default false
);

-- 2. Add missing columns to profiles table
alter table public.profiles 
  add column if not exists referral_code text unique;

-- 3. Add missing columns to transactions table
alter table public.transactions 
  add column if not exists currency text default 'USDT',
  add column if not exists from_user_id uuid references profiles(id),
  add column if not exists to_user_id uuid references profiles(id),
  add column if not exists stake_id bigint references stakes(id),
  add column if not exists meta jsonb default '{}'::jsonb;

-- 4. Add missing columns to plans table
alter table public.plans 
  add column if not exists currency text default 'USDT';

-- 5. Add missing columns to stakes table
alter table public.stakes 
  add column if not exists currency text default 'USDT',
  add column if not exists flex_days int;

-- 6. Create wallets table if it doesn't exist
create table if not exists public.wallets (
  user_id uuid not null references profiles(id) on delete cascade,
  currency text not null,
  available numeric default 0,
  locked numeric default 0,
  updated_at timestamptz default now(),
  primary key (user_id, currency)
);

-- 7. Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.stakes enable row level security;
alter table public.transactions enable row level security;
alter table public.wallets enable row level security;
alter table public.referrals enable row level security;

-- 8. Create RLS policies
-- Profiles policies
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (id = auth.uid());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (id = auth.uid());

-- Wallets policies
drop policy if exists wallets_select_own on public.wallets;
create policy wallets_select_own on public.wallets
  for select using (user_id = auth.uid());

drop policy if exists wallets_update_restricted on public.wallets;
create policy wallets_update_restricted on public.wallets
  for update using (false);

-- Stakes policies
drop policy if exists stakes_select_own on public.stakes;
create policy stakes_select_own on public.stakes
  for select using (user_id = auth.uid());

-- Transactions policies
drop policy if exists transactions_select_own on public.transactions;
create policy transactions_select_own on public.transactions
  for select using (
    user_id = auth.uid() or 
    from_user_id = auth.uid() or 
    to_user_id = auth.uid()
  );

-- Referrals policies
drop policy if exists referrals_select_own on public.referrals;
create policy referrals_select_own on public.referrals
  for select using (referrer_id = auth.uid() or referred_id = auth.uid());

-- Plans policies (everyone can read)
drop policy if exists plans_select_all on public.plans;
create policy plans_select_all on public.plans
  for select using (true);

-- 9. Create or replace the handle_new_user function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_referral_code text;
begin
  -- Generate unique referral code
  v_referral_code := upper(substring(md5(random()::text) from 1 for 8));
  
  -- Ensure referral code is unique
  while exists (select 1 from public.profiles where referral_code = v_referral_code) loop
    v_referral_code := upper(substring(md5(random()::text) from 1 for 8));
  end loop;

  insert into public.profiles (id, email, referral_code)
  values (new.id, new.email, v_referral_code)
  on conflict do nothing;

  -- Create initial demo wallets with $2000 total
  begin
    insert into public.wallets (user_id, currency, available) values
      (new.id, 'ETH', 800),
      (new.id, 'BTC', 500),
      (new.id, 'USDT', 400),
      (new.id, 'BNB', 200),
      (new.id, 'MATIC', 100)
    on conflict (user_id, currency) do nothing;
  exception when others then
    null;
  end;

  return new;
end;
$$;

-- 10. Create trigger for new users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 11. Create some initial plans
insert into public.plans (name, days, apr, type, currency) values
  ('ETH Locked 30', 30, 0.12, 'locked', 'ETH'),
  ('ETH Locked 90', 90, 0.15, 'locked', 'ETH'),
  ('ETH Flexible', 0, 0.08, 'flexible', 'ETH'),
  ('BTC Locked 30', 30, 0.10, 'locked', 'BTC'),
  ('BTC Locked 90', 90, 0.13, 'locked', 'BTC'),
  ('BTC Flexible', 0, 0.06, 'flexible', 'BTC'),
  ('USDT Locked 30', 30, 0.15, 'locked', 'USDT'),
  ('USDT Locked 90', 90, 0.18, 'locked', 'USDT'),
  ('USDT Flexible', 0, 0.10, 'flexible', 'USDT'),
  ('BNB Locked 30', 30, 0.14, 'locked', 'BNB'),
  ('BNB Locked 90', 90, 0.17, 'locked', 'BNB'),
  ('BNB Flexible', 0, 0.09, 'flexible', 'BNB'),
  ('MATIC Locked 30', 30, 0.16, 'locked', 'MATIC'),
  ('MATIC Locked 90', 90, 0.19, 'locked', 'MATIC'),
  ('MATIC Flexible', 0, 0.11, 'flexible', 'MATIC')
on conflict do nothing;

-- 12. Update existing users to have demo wallets
-- This will add wallets for existing users who don't have them
insert into public.wallets (user_id, currency, available)
select 
  p.id,
  currency,
  case currency
    when 'ETH' then 800
    when 'BTC' then 500
    when 'USDT' then 400
    when 'BNB' then 200
    when 'MATIC' then 100
  end as amount
from public.profiles p
cross join (values ('ETH'), ('BTC'), ('USDT'), ('BNB'), ('MATIC')) as currencies(currency)
where not exists (
  select 1 from public.wallets w 
  where w.user_id = p.id and w.currency = currencies.currency
);

-- 13. Generate referral codes for existing users who don't have them
update public.profiles 
set referral_code = upper(substring(md5(random()::text) from 1 for 8))
where referral_code is null;

-- Ensure all referral codes are unique
do $$
declare
  rec record;
  new_code text;
begin
  for rec in 
    select id, referral_code 
    from public.profiles 
    where referral_code in (
      select referral_code 
      from public.profiles 
      group by referral_code 
      having count(*) > 1
    )
  loop
    loop
      new_code := upper(substring(md5(random()::text) from 1 for 8));
      if not exists (select 1 from public.profiles where referral_code = new_code) then
        update public.profiles 
        set referral_code = new_code 
        where id = rec.id;
        exit;
      end if;
    end loop;
  end loop;
end $$;
