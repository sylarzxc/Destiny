-- =============================================================
-- Destiny Platform Database Schema
-- =============================================================

-- ============
-- Core Tables
-- ============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text default 'user',
  created_at timestamptz default now()
);

create table if not exists public.plans (
  id bigserial primary key,
  name text not null,
  days int not null,
  apr numeric not null,
  type text not null check (type in ('locked','flexible'))
);

create table if not exists public.stakes (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id bigint references public.plans(id),
  amount numeric not null,
  start_at timestamptz default now(),
  end_at timestamptz,
  status text default 'active' check (status in ('active','completed','cancelled')),
  yield_accumulated numeric default 0,
  currency text default 'USDT',
  flex_days int
);

create table if not exists public.transactions (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('deposit','withdraw','stake_create','stake_yield')),
  amount numeric not null,
  created_at timestamptz default now(),
  meta jsonb default '{}'::jsonb
);

create table if not exists public.settings (
  key text primary key,
  value jsonb not null
);

create table if not exists public.wallets (
  user_id uuid not null references auth.users(id) on delete cascade,
  currency text not null,
  available numeric not null default 0,
  locked numeric not null default 0,
  updated_at timestamptz default now(),
  primary key (user_id, currency)
);

create table if not exists public.admin_logs (
  id bigserial primary key,
  admin_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_type text,
  target_id text,
  meta jsonb,
  created_at timestamptz default now()
);

-- ==================================
-- Automatic profile + wallet seeding
-- ==================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict do nothing;

  begin
    insert into public.wallets (user_id, currency, available)
    values (new.id, 'USDT', 500)
    on conflict (user_id, currency) do nothing;
  exception when others then
    null;
  end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill demo wallets for existing users
insert into public.wallets (user_id, currency, available)
select u.id, 'USDT', 500
from auth.users u
where not exists (
  select 1 from public.wallets w
  where w.user_id = u.id and w.currency = 'USDT'
);

-- =====================
-- Row Level Security
-- =====================
alter table public.profiles enable row level security;
alter table public.stakes enable row level security;
alter table public.transactions enable row level security;
alter table public.wallets enable row level security;
alter table public.admin_logs enable row level security;
alter table public.settings enable row level security;
alter table public.plans enable row level security;

do $$
begin
  -- Profile policies
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'profiles_select_self') then
    create policy profiles_select_self on public.profiles
      for select using (id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'profiles_update_self') then
    create policy profiles_update_self on public.profiles
      for update using (id = auth.uid());
  end if;

  -- Stakes policies
  if not exists (select 1 from pg_policies where tablename = 'stakes' and policyname = 'stakes_select_self') then
    create policy stakes_select_self on public.stakes
      for select using (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where tablename = 'stakes' and policyname = 'stakes_insert_self') then
    create policy stakes_insert_self on public.stakes
      for insert with check (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where tablename = 'stakes' and policyname = 'stakes_update_self') then
    create policy stakes_update_self on public.stakes
      for update using (user_id = auth.uid());
  end if;

  -- Transactions policies
  if not exists (select 1 from pg_policies where tablename = 'transactions' and policyname = 'transactions_select_self') then
    create policy transactions_select_self on public.transactions
      using (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where tablename = 'transactions' and policyname = 'transactions_insert_self') then
    create policy transactions_insert_self on public.transactions
      for insert with check (user_id = auth.uid());
  end if;

  -- Wallet policies
  if not exists (select 1 from pg_policies where tablename = 'wallets' and policyname = 'wallets_select_self') then
    create policy wallets_select_self on public.wallets
      for select using (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where tablename = 'wallets' and policyname = 'wallets_update_self') then
    create policy wallets_update_self on public.wallets
      for update using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;

  -- Admin logs readable тільки адміну
  if not exists (select 1 from pg_policies where tablename = 'admin_logs' and policyname = 'admin_logs_admin_only') then
    create policy admin_logs_admin_only on public.admin_logs
      using (public.is_admin());
  end if;

  -- Settings / plans
  if not exists (select 1 from pg_policies where tablename = 'settings' and policyname = 'settings_public_select') then
    create policy settings_public_select on public.settings for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'settings' and policyname = 'settings_admin_write') then
    create policy settings_admin_write on public.settings for all using (public.is_admin()) with check (public.is_admin());
  end if;

  if not exists (select 1 from pg_policies where tablename = 'plans' and policyname = 'plans_public_select') then
    create policy plans_public_select on public.plans for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'plans' and policyname = 'plans_admin_write') then
    create policy plans_admin_write on public.plans for all using (public.is_admin()) with check (public.is_admin());
  end if;
end
$$;

-- =============
-- Seeded Plans
-- =============
insert into public.plans (name, days, apr, type) values
  ('Locked 30', 30, 0.05, 'locked'),
  ('Locked 90', 90, 0.12, 'locked'),
  ('Locked 180', 180, 0.20, 'locked'),
  ('Flexible Daily', 1, 0.20, 'flexible')
on conflict do nothing;

-- ========================
-- Utility helper functions
-- ========================
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  select role into v_role
  from public.profiles
  where id = auth.uid();
  return lower(coalesce(v_role, 'user')) = 'admin';
end;
$$;

-- =================================
-- User-facing RPC: open / withdraw stake
-- =================================
create or replace function public.open_stake(
  p_plan_id bigint,
  p_amount numeric,
  p_currency text default 'USDT',
  p_flex_days int default null
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan public.plans%rowtype;
  v_stake_id bigint;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if coalesce(p_amount, 0) <= 0 then
    raise exception 'amount must be > 0';
  end if;

  select * into v_plan from public.plans where id = p_plan_id;
  if not found then
    raise exception 'plan not found';
  end if;

  insert into public.wallets (user_id, currency)
  values (auth.uid(), coalesce(p_currency, 'USDT'))
  on conflict do nothing;

  update public.wallets
     set available = available - p_amount,
         locked = locked + p_amount,
         updated_at = now()
   where user_id = auth.uid()
     and currency = coalesce(p_currency, 'USDT')
     and available >= p_amount;
  if not found then
    raise exception 'insufficient funds';
  end if;

  insert into public.stakes (user_id, plan_id, amount, status, start_at, currency, flex_days)
  values (auth.uid(), p_plan_id, p_amount, 'active', now(), coalesce(p_currency, 'USDT'), p_flex_days)
  returning id into v_stake_id;

  insert into public.transactions (user_id, type, amount, meta)
  values (
    auth.uid(),
    'stake_create',
    p_amount,
    jsonb_build_object('stake_id', v_stake_id, 'plan_id', p_plan_id, 'currency', coalesce(p_currency, 'USDT'))
  );

  return v_stake_id;
end;
$$;

create or replace function public.withdraw_stake(
  p_stake_id bigint
)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  v_stake public.stakes%rowtype;
  v_amount numeric;
begin
  select * into v_stake
    from public.stakes
   where id = p_stake_id
     and user_id = auth.uid()
     and status = 'active'
     for update;
  if not found then
    raise exception 'stake not found or already closed';
  end if;

  if v_stake.end_at is not null and v_stake.end_at > now() then
    raise exception 'stake still locked';
  end if;

  update public.wallets
     set locked = locked - v_stake.amount,
         available = available + v_stake.amount,
         updated_at = now()
   where user_id = v_stake.user_id
     and currency = coalesce(v_stake.currency, 'USDT');

  update public.stakes
     set status = 'completed',
         end_at = now()
   where id = v_stake.id;

  v_amount := v_stake.amount;

  insert into public.transactions (user_id, type, amount, meta)
  values (
    v_stake.user_id,
    'withdraw',
    v_amount,
    jsonb_build_object('stake_id', v_stake.id, 'currency', coalesce(v_stake.currency, 'USDT'))
  );

  return v_amount;
end;
$$;

-- =========================
-- Admin utility (list pending)
-- =========================
create or replace function public.admin_list_pending(
  p_limit int default 20,
  p_offset int default 0
)
returns table (
  id bigint,
  created_at timestamptz,
  user_id uuid,
  email text,
  type text,
  amount numeric,
  asset text,
  amount_asset numeric,
  status text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admin only';
  end if;

  return query
    select t.id,
           t.created_at,
           t.user_id,
           coalesce(p.email, ''),
           t.type,
           t.amount,
           coalesce(t.meta->>'asset', 'USDT') as asset,
           coalesce((t.meta->>'amount_asset')::numeric, t.amount) as amount_asset,
           coalesce(t.meta->>'status', 'pending') as status
      from public.transactions t
      left join public.profiles p on p.id = t.user_id
     where coalesce(t.meta->>'status', 'pending') = 'pending'
     order by t.created_at desc
     limit coalesce(p_limit, 20)
    offset coalesce(p_offset, 0);
end;
$$;

create or replace function public.admin_approve_deposit(p_tx_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tx record;
  v_asset text;
  v_amount numeric;
begin
  if not public.is_admin() then
    raise exception 'admin only';
  end if;

  select * into v_tx from public.transactions where id = p_tx_id and type = 'deposit' for update;
  if not found then
    raise exception 'deposit not found';
  end if;
  if coalesce(v_tx.meta->>'status', 'pending') <> 'pending' then
    return;
  end if;

  v_asset := upper(coalesce(v_tx.meta->>'asset', 'USDT'));
  v_amount := coalesce((v_tx.meta->>'amount_asset')::numeric, v_tx.amount);

  insert into public.wallets (user_id, currency)
  values (v_tx.user_id, v_asset)
  on conflict do nothing;

  update public.wallets
     set available = available + v_amount,
         updated_at = now()
   where user_id = v_tx.user_id
     and currency = v_asset;

  update public.transactions
     set meta = jsonb_set(coalesce(meta, '{}'::jsonb), '{status}', '"approved"')
   where id = v_tx.id;
end;
$$;

create or replace function public.admin_approve_withdraw(p_tx_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tx record;
  v_asset text;
  v_amount numeric;
begin
  if not public.is_admin() then
    raise exception 'admin only';
  end if;

  select * into v_tx from public.transactions where id = p_tx_id and type = 'withdraw' for update;
  if not found then
    raise exception 'withdraw not found';
  end if;
  if coalesce(v_tx.meta->>'status', 'pending') <> 'pending' then
    return;
  end if;

  v_asset := upper(coalesce(v_tx.meta->>'asset', 'USDT'));
  v_amount := coalesce((v_tx.meta->>'amount_asset')::numeric, v_tx.amount);

  update public.wallets
     set available = available - v_amount,
         updated_at = now()
   where user_id = v_tx.user_id
     and currency = v_asset
     and available >= v_amount;
  if not found then
    raise exception 'insufficient funds for withdraw';
  end if;

  update public.transactions
     set meta = jsonb_set(coalesce(meta, '{}'::jsonb), '{status}', '"approved"')
   where id = v_tx.id;
end;
$$;

create or replace function public.admin_reject_tx(p_tx_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tx record;
begin
  if not public.is_admin() then
    raise exception 'admin only';
  end if;

  select * into v_tx from public.transactions where id = p_tx_id for update;
  if not found then
    raise exception 'transaction not found';
  end if;
  if coalesce(v_tx.meta->>'status', 'pending') <> 'pending' then
    return;
  end if;

  update public.transactions
     set meta = jsonb_set(coalesce(meta, '{}'::jsonb), '{status}', '"rejected"')
   where id = v_tx.id;
end;
$$;

create or replace function public.admin_list_users(
  p_limit int default 50,
  p_offset int default 0,
  p_search text default null
)
returns table (
  id uuid,
  email text,
  display_name text,
  role text,
  created_at timestamptz,
  total_available numeric,
  total_locked numeric,
  active_stakes int,
  pending_deposits int,
  pending_withdraws int,
  next_maturity timestamptz,
  last_transaction timestamptz,
  last_sign_in_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admin only';
  end if;

  return query
    with filtered as (
      select p.*
      from public.profiles p
      where (
        p_search is null or p_search = '' or
        p.email ilike '%' || p_search || '%' or
        coalesce(p.display_name, '') ilike '%' || p_search || '%'
      )
      order by p.created_at desc
      limit coalesce(p_limit, 50)
      offset coalesce(p_offset, 0)
    ),
    wallet_totals as (
      select user_id,
             coalesce(sum(available), 0) as total_available,
             coalesce(sum(locked), 0) as total_locked
      from public.wallets
      group by user_id
    ),
    stake_stats as (
      select user_id,
             count(*) filter (where status = 'active') as active_stakes,
             min(end_at) filter (where status = 'active' and end_at is not null) as next_maturity
      from public.stakes
      group by user_id
    ),
    pending_tx as (
      select user_id,
             count(*) filter (where type = 'deposit' and coalesce(meta->>'status', 'pending') = 'pending') as pending_deposits,
             count(*) filter (where type = 'withdraw' and coalesce(meta->>'status', 'pending') = 'pending') as pending_withdraws,
             max(created_at) as last_transaction
      from public.transactions
      group by user_id
    ),
    auth_data as (
      select id, last_sign_in_at from auth.users
    )
    select f.id,
           f.email,
           f.display_name,
           f.role,
           f.created_at,
           coalesce(w.total_available, 0) as total_available,
           coalesce(w.total_locked, 0) as total_locked,
           coalesce(s.active_stakes, 0) as active_stakes,
           coalesce(pt.pending_deposits, 0) as pending_deposits,
           coalesce(pt.pending_withdraws, 0) as pending_withdraws,
           s.next_maturity,
           pt.last_transaction,
           a.last_sign_in_at
    from filtered f
    left join wallet_totals w on w.user_id = f.id
    left join stake_stats s on s.user_id = f.id
    left join pending_tx pt on pt.user_id = f.id
    left join auth_data a on a.id = f.id;
end;
$$;

create or replace function public.admin_set_role(p_user_id uuid, p_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  if not public.is_admin() then
    raise exception 'admin only';
  end if;

  v_role := lower(trim(coalesce(p_role, '')));
  if v_role not in ('user', 'admin') then
    raise exception 'invalid role';
  end if;

  update public.profiles
     set role = v_role
   where id = p_user_id;
end;
$$;

create or replace function public.admin_dashboard_overview()
returns table (
  total_users bigint,
  total_wallet_available numeric,
  total_wallet_locked numeric,
  pending_requests bigint,
  active_stakes bigint,
  expiring_24h bigint,
  total_active_deposit numeric
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admin only';
  end if;

  return query
    select
      (select count(*) from public.profiles) as total_users,
      coalesce((select sum(available) from public.wallets), 0) as total_wallet_available,
      coalesce((select sum(locked) from public.wallets), 0) as total_wallet_locked,
      (select count(*) from public.transactions t where coalesce(t.meta->>'status', 'pending') = 'pending') as pending_requests,
      (select count(*) from public.stakes s where s.status = 'active') as active_stakes,
      (select count(*) from public.stakes s where s.status = 'active' and s.end_at is not null and s.end_at <= now() + interval '24 hours') as expiring_24h,
      coalesce((select sum(amount) from public.stakes where status = 'active'), 0) as total_active_deposit;
end;
$$;

create or replace function public.admin_list_stakes(
  p_limit int default 50,
  p_offset int default 0,
  p_status text default null,
  p_search text default null
)
returns table (
  id bigint,
  user_id uuid,
  email text,
  display_name text,
  plan_name text,
  amount numeric,
  currency text,
  status text,
  start_at timestamptz,
  end_at timestamptz,
  seconds_left bigint,
  apr numeric,
  plan_days int,
  plan_type text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admin only';
  end if;

  return query
    select
      s.id,
      s.user_id,
      p.email,
      p.display_name,
      pl.name,
      s.amount,
      coalesce(s.currency, 'USDT') as currency,
      s.status,
      s.start_at,
      s.end_at,
      case
        when s.status = 'active' and s.end_at is not null and s.end_at > now()
          then extract(epoch from (s.end_at - now()))::bigint
        else 0
      end as seconds_left,
      pl.apr,
      pl.days,
      pl.type
    from public.stakes s
    left join public.profiles p on p.id = s.user_id
    left join public.plans pl on pl.id = s.plan_id
    where (p_status is null or p_status = '' or lower(s.status) = lower(p_status))
      and (
        p_search is null or p_search = '' or
        p.email ilike '%' || p_search || '%' or
        coalesce(p.display_name, '') ilike '%' || p_search || '%' or
        s.id::text ilike '%' || p_search || '%'
      )
    order by s.start_at desc
    limit coalesce(p_limit, 50)
    offset coalesce(p_offset, 0);
end;
$$;

create or replace function public.admin_user_detail(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin boolean;
  result jsonb;
begin
  select public.is_admin() into v_admin;
  if not v_admin then
    raise exception 'admin only';
  end if;

  select jsonb_build_object(
    'profile', to_jsonb(p),
    'wallets', coalesce((
      select jsonb_agg(
        to_jsonb(w) || jsonb_build_object('total', w.available + w.locked)
        order by w.currency
      )
      from public.wallets w
      where w.user_id = p.id
    ), '[]'::jsonb),
    'stakes', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'amount', s.amount,
          'currency', coalesce(s.currency, 'USDT'),
          'status', s.status,
          'start_at', s.start_at,
          'end_at', s.end_at,
          'seconds_left', case
            when s.status = 'active' and s.end_at is not null and s.end_at > now()
              then extract(epoch from (s.end_at - now()))::bigint
            else 0
          end,
          'plan', to_jsonb(pl)
        )
        order by s.start_at desc
      )
      from public.stakes s
      left join public.plans pl on pl.id = s.plan_id
      where s.user_id = p.id
    ), '[]'::jsonb),
    'recent_transactions', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', t.id,
          'type', t.type,
          'amount', t.amount,
          'created_at', t.created_at,
          'meta', t.meta
        )
        order by t.created_at desc
      )
      from (
        select t.*
        from public.transactions t
        where t.user_id = p.id
        order by t.created_at desc
        limit 30
      ) t
    ), '[]'::jsonb),
    'pending_requests', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', t.id,
          'type', t.type,
          'amount', t.amount,
          'meta', t.meta,
          'created_at', t.created_at
        )
      )
      from public.transactions t
      where t.user_id = p.id and coalesce(t.meta->>'status', 'pending') = 'pending'
    ), '[]'::jsonb)
  ) into result
  from public.profiles p
  where p.id = p_user_id;

  return result;
end;
$$;

create or replace function public.admin_force_close_stake(
  p_stake_id bigint,
  p_note text default null,
  p_bonus numeric default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  s public.stakes%rowtype;
  v_bonus numeric := coalesce(p_bonus, 0);
  v_currency text;
begin
  if not public.is_admin() then
    raise exception 'admin only';
  end if;

  select * into s
    from public.stakes
   where id = p_stake_id
   for update;
  if not found then
    raise exception 'stake not found';
  end if;
  if s.status <> 'active' then
    return;
  end if;

  v_currency := coalesce(s.currency, 'USDT');

  insert into public.wallets (user_id, currency)
  values (s.user_id, v_currency)
  on conflict do nothing;

  update public.wallets
     set locked = locked - s.amount,
         available = available + s.amount,
         updated_at = now()
   where user_id = s.user_id
     and currency = v_currency
     and locked >= s.amount;
  if not found then
    raise exception 'locked balance not found for stake';
  end if;

  if v_bonus > 0 then
    update public.wallets
       set available = available + v_bonus,
           updated_at = now()
     where user_id = s.user_id
       and currency = v_currency;
  end if;

  update public.stakes
     set status = 'cancelled',
         end_at = now()
   where id = p_stake_id;

  insert into public.transactions (user_id, type, amount, meta)
  values (
    s.user_id,
    'withdraw',
    s.amount + v_bonus,
    jsonb_build_object(
      'stake_id', p_stake_id,
      'admin_force', true,
      'currency', v_currency,
      'bonus', v_bonus,
      'note', p_note
    )
  );

  insert into public.admin_logs (admin_id, action, target_type, target_id, meta)
  values (
    auth.uid(),
    'force_close_stake',
    'stake',
    p_stake_id::text,
    jsonb_build_object('note', p_note, 'bonus', v_bonus)
  );
end;
$$;

create or replace function public.admin_credit_wallet(
  p_user_id uuid,
  p_currency text,
  p_amount numeric,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_currency text;
begin
  if not public.is_admin() then
    raise exception 'admin only';
  end if;
  if coalesce(p_amount, 0) <= 0 then
    raise exception 'amount must be > 0';
  end if;

  v_currency := upper(coalesce(p_currency, 'USDT'));

  insert into public.wallets (user_id, currency)
  values (p_user_id, v_currency)
  on conflict do nothing;

  update public.wallets
     set available = available + p_amount,
         updated_at = now()
   where user_id = p_user_id
     and currency = v_currency;

  insert into public.admin_logs (admin_id, action, target_type, target_id, meta)
  values (
    auth.uid(),
    'credit_wallet',
    'user',
    p_user_id::text,
    jsonb_build_object('currency', v_currency, 'amount', p_amount, 'note', p_note)
  );
end;
$$;

create or replace function public.admin_debit_wallet(
  p_user_id uuid,
  p_currency text,
  p_amount numeric,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_currency text;
begin
  if not public.is_admin() then
    raise exception 'admin only';
  end if;
  if coalesce(p_amount, 0) <= 0 then
    raise exception 'amount must be > 0';
  end if;

  v_currency := upper(coalesce(p_currency, 'USDT'));

  update public.wallets
     set available = available - p_amount,
         updated_at = now()
   where user_id = p_user_id
     and currency = v_currency
     and available >= p_amount;
  if not found then
    raise exception 'insufficient funds';
  end if;

  insert into public.admin_logs (admin_id, action, target_type, target_id, meta)
  values (
    auth.uid(),
    'debit_wallet',
    'user',
    p_user_id::text,
    jsonb_build_object('currency', v_currency, 'amount', p_amount, 'note', p_note)
  );
end;
$$;

create or replace function public.admin_update_setting(
  p_key text,
  p_value jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin boolean;
begin
  select public.is_admin() into v_admin;
  if not v_admin then
    raise exception 'admin only';
  end if;

  insert into public.settings (key, value)
  values (p_key, p_value)
  on conflict (key) do update set value = excluded.value;

  insert into public.admin_logs (admin_id, action, target_type, target_id, meta)
  values (
    auth.uid(),
    'update_setting',
    'setting',
    p_key,
    jsonb_build_object('value', p_value)
  );
end;
$$;

create or replace function public.admin_recent_admin_logs(
  p_limit int default 50
)
returns table (
  id bigint,
  admin_id uuid,
  admin_email text,
  action text,
  target_type text,
  target_id text,
  meta jsonb,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admin only';
  end if;

  return query
    select
      l.id,
      l.admin_id,
      pr.email,
      l.action,
      l.target_type,
      l.target_id,
      l.meta,
      l.created_at
    from public.admin_logs l
    left join public.profiles pr on pr.id = l.admin_id
    order by l.created_at desc
    limit coalesce(p_limit, 50);
end;
$$;
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

