-- =============================================================
-- Migration Script for Existing Data
-- Updates existing users and creates initial staking plans
-- =============================================================

-- 1. Update existing profiles to add referral codes
UPDATE public.profiles 
SET referral_code = upper(substring(md5(random()::text) from 1 for 8))
WHERE referral_code IS NULL;

-- Ensure referral codes are unique
DO $$
DECLARE
    rec RECORD;
    new_code TEXT;
BEGIN
    FOR rec IN 
        SELECT id FROM public.profiles 
        WHERE referral_code IN (
            SELECT referral_code 
            FROM public.profiles 
            GROUP BY referral_code 
            HAVING COUNT(*) > 1
        )
    LOOP
        LOOP
            new_code := upper(substring(md5(random()::text) from 1 for 8));
            IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = new_code) THEN
                UPDATE public.profiles SET referral_code = new_code WHERE id = rec.id;
                EXIT;
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- 2. Create wallets for existing users who don't have them
INSERT INTO public.wallets (user_id, currency, available)
SELECT 
    u.id,
    'ETH',
    800
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM public.wallets w
    WHERE w.user_id = u.id AND w.currency = 'ETH'
);

INSERT INTO public.wallets (user_id, currency, available)
SELECT 
    u.id,
    'BTC',
    500
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM public.wallets w
    WHERE w.user_id = u.id AND w.currency = 'BTC'
);

INSERT INTO public.wallets (user_id, currency, available)
SELECT 
    u.id,
    'USDT',
    400
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM public.wallets w
    WHERE w.user_id = u.id AND w.currency = 'USDT'
);

INSERT INTO public.wallets (user_id, currency, available)
SELECT 
    u.id,
    'BNB',
    200
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM public.wallets w
    WHERE w.user_id = u.id AND w.currency = 'BNB'
);

INSERT INTO public.wallets (user_id, currency, available)
SELECT 
    u.id,
    'MATIC',
    100
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM public.wallets w
    WHERE w.user_id = u.id AND w.currency = 'MATIC'
);

-- 3. Update existing stakes to have currency field
UPDATE public.stakes 
SET currency = 'USDT' 
WHERE currency IS NULL;

-- 4. Update existing transactions to have currency field
UPDATE public.transactions 
SET currency = 'USDT' 
WHERE currency IS NULL;

-- 5. Create initial staking plans if they don't exist
INSERT INTO public.plans (name, days, apr, type, currency) VALUES
  -- ETH Plans
  ('ETH Locked 30', 30, 0.05, 'locked', 'ETH'),
  ('ETH Locked 90', 90, 0.12, 'locked', 'ETH'),
  ('ETH Locked 180', 180, 0.20, 'locked', 'ETH'),
  ('ETH Flexible Daily', 1, 0.20, 'flexible', 'ETH'),
  
  -- BTC Plans
  ('BTC Locked 30', 30, 0.05, 'locked', 'BTC'),
  ('BTC Locked 90', 90, 0.12, 'locked', 'BTC'),
  ('BTC Locked 180', 180, 0.20, 'locked', 'BTC'),
  ('BTC Flexible Daily', 1, 0.20, 'flexible', 'BTC'),
  
  -- USDT Plans
  ('USDT Locked 30', 30, 0.05, 'locked', 'USDT'),
  ('USDT Locked 90', 90, 0.12, 'locked', 'USDT'),
  ('USDT Locked 180', 180, 0.20, 'locked', 'USDT'),
  ('USDT Flexible Daily', 1, 0.20, 'flexible', 'USDT'),
  
  -- BNB Plans
  ('BNB Locked 30', 30, 0.05, 'locked', 'BNB'),
  ('BNB Locked 90', 90, 0.12, 'locked', 'BNB'),
  ('BNB Locked 180', 180, 0.20, 'locked', 'BNB'),
  ('BNB Flexible Daily', 1, 0.20, 'flexible', 'BNB'),
  
  -- MATIC Plans
  ('MATIC Locked 30', 30, 0.05, 'locked', 'MATIC'),
  ('MATIC Locked 90', 90, 0.12, 'locked', 'MATIC'),
  ('MATIC Locked 180', 180, 0.20, 'locked', 'MATIC'),
  ('MATIC Flexible Daily', 1, 0.20, 'flexible', 'MATIC')
ON CONFLICT DO NOTHING;

-- 6. Create admin user if none exists
INSERT INTO public.profiles (id, email, role)
SELECT 
    u.id,
    u.email,
    'admin'
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.role = 'admin'
)
LIMIT 1;

-- 7. Add some sample settings
INSERT INTO public.settings (key, value) VALUES
  ('platform_name', '"Destiny Platform"'),
  ('min_stake_amount', '0.01'),
  ('max_stake_amount', '1000000'),
  ('referral_bonus_percentage', '10'),
  ('daily_interest_enabled', 'true'),
  ('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;

-- 8. Create sample referral relationships for testing
INSERT INTO public.referrals (referrer_id, referred_id, referral_code, bonus_paid)
SELECT 
    p1.id,
    p2.id,
    p1.referral_code,
    false
FROM public.profiles p1
CROSS JOIN public.profiles p2
WHERE p1.id != p2.id
  AND p1.role = 'admin'
  AND NOT EXISTS (
    SELECT 1 FROM public.referrals r 
    WHERE r.referred_id = p2.id
  )
LIMIT 5;

-- 9. Log the migration
INSERT INTO public.admin_logs (action, target_type, meta)
VALUES (
    'data_migration',
    'system',
    jsonb_build_object(
        'version', '0.3',
        'timestamp', now(),
        'description', 'Updated existing data for enhanced schema'
    )
);

-- 10. Verify the migration
DO $$
DECLARE
    user_count INTEGER;
    wallet_count INTEGER;
    plan_count INTEGER;
    referral_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM public.profiles;
    SELECT COUNT(*) INTO wallet_count FROM public.wallets;
    SELECT COUNT(*) INTO plan_count FROM public.plans;
    SELECT COUNT(*) INTO referral_count FROM public.referrals;
    
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Users: %', user_count;
    RAISE NOTICE 'Wallets: %', wallet_count;
    RAISE NOTICE 'Plans: %', plan_count;
    RAISE NOTICE 'Referrals: %', referral_count;
END $$;
