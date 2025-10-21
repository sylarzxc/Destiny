# 🗄️ Database Setup Guide - Destiny Platform

## Step-by-Step Database Setup

### 1. Access Supabase SQL Editor
1. Go to your Supabase dashboard: https://supabase.com
2. Select your project: `cwzcxjvjxxepkilfnrwu`
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

### 2. Run the Complete Database Schema
1. Copy the entire content from `version 0.3/sql-enhanced.bd`
2. Paste it into the SQL Editor
3. Click **"Run"** to execute the script

### 3. What This Script Does

#### Creates Core Tables:
- **profiles**: User profiles with referral codes
- **wallets**: Multi-currency wallet balances (ETH, BTC, USDT, BNB, MATIC)
- **stakes**: Staking positions with yield tracking
- **transactions**: All financial transactions
- **plans**: Staking plans for different currencies
- **referrals**: Referral system tracking
- **admin_logs**: Admin action logging
- **settings**: Platform configuration

#### Sets Up Security:
- **Row Level Security (RLS)** on all tables
- **User isolation**: Users can only see their own data
- **Admin policies**: Admins can manage everything
- **Secure functions**: Protected database operations

#### Creates Demo Data:
- **Staking plans** for all currencies (ETH, BTC, USDT, BNB, MATIC)
- **Flexible plans**: Daily interest (20% APR)
- **Locked plans**: 30/90/180 days (5%/12%/20% APR)

#### Sets Up Automation:
- **New user trigger**: Automatically creates profile and $2000 demo balance
- **Referral code generation**: Unique 8-character codes
- **Balance distribution**: ETH: $800, BTC: $500, USDT: $400, BNB: $200, MATIC: $100

### 4. Verify Setup
After running the script, verify these tables exist:
1. Go to **"Table Editor"** in Supabase
2. Check that these tables are created:
   - profiles
   - wallets
   - stakes
   - transactions
   - plans
   - referrals
   - admin_logs
   - settings

### 5. Test User Registration
1. Go to your app and register a new user
2. Check the **profiles** table - should see new user
3. Check the **wallets** table - should see 5 wallets with demo balances
4. Verify the user has a unique **referral_code**

### 6. Create Admin User
To create an admin user, run this SQL:
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

### 7. Expected Demo Balances
New users will receive:
- **ETH**: 800 (equivalent to ~$800)
- **BTC**: 500 (equivalent to ~$500) 
- **USDT**: 400 (equivalent to ~$400)
- **BNB**: 200 (equivalent to ~$200)
- **MATIC**: 100 (equivalent to ~$100)
- **Total**: $2000 demo value

### 8. Staking Plans Available
Each currency has 4 plans:
- **Flexible Daily**: 20% APR, withdraw anytime
- **Locked 30 Days**: 5% APR
- **Locked 90 Days**: 12% APR  
- **Locked 180 Days**: 20% APR

## 🚨 Important Notes

- **Demo Mode**: All balances are simulated (no real money)
- **Real-time**: All tables support real-time updates
- **Security**: RLS ensures users only see their own data
- **Admin Access**: Only users with role='admin' can access admin functions
- **Referral System**: Users get unique codes and earn bonuses

## ✅ Success Indicators

After setup, you should see:
1. All tables created successfully
2. Staking plans populated (20 plans total)
3. New user registration creates profile + wallets automatically
4. RLS policies active (check in Authentication > Policies)
5. Real-time subscriptions working

## 🔧 Troubleshooting

If you encounter errors:
1. **Permission errors**: Make sure you're using the project owner account
2. **Table conflicts**: The script uses `IF NOT EXISTS` so it's safe to run multiple times
3. **RLS errors**: Check that policies are created correctly
4. **Function errors**: Verify all functions are created without syntax errors

Once the database is set up, we can proceed to deploy the Edge Functions and test the complete platform!

