# 🔧 Supabase Connection Fix Guide

## The Problem
Your website is showing `net::ERR_NAME_NOT_RESOLVED` and `TypeError: Failed to fetch` errors because the Supabase connection is not configured properly.

## 🚀 Quick Fix Steps

### 1. Create Environment File
Create a file named `.env.local` in your `version 0.3` folder with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Get Your Supabase Credentials

#### Option A: If you already have a Supabase project
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project
4. Go to **Settings** → **API**
5. Copy:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon/public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

#### Option B: If you need to create a new Supabase project
1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Choose your organization
4. Enter project details:
   - **Name**: Destiny Platform
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to your users
5. Click **"Create new project"**
6. Wait for setup to complete (2-3 minutes)
7. Go to **Settings** → **API** and copy your credentials

### 3. Set Up Database Schema
After creating your Supabase project, you need to set up the database tables. Run this SQL in your Supabase SQL Editor:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  role TEXT DEFAULT 'user',
  referral_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  currency TEXT NOT NULL,
  available DECIMAL(20,8) DEFAULT 0,
  locked DECIMAL(20,8) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, currency)
);

-- Create staking plans table
CREATE TABLE IF NOT EXISTS staking_plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  days INTEGER NOT NULL,
  apr DECIMAL(5,2) NOT NULL,
  type TEXT CHECK (type IN ('locked', 'flexible')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stakes table
CREATE TABLE IF NOT EXISTS stakes (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id INTEGER REFERENCES staking_plans(id),
  amount DECIMAL(20,8) NOT NULL,
  start_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_at TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
  yield_accumulated DECIMAL(20,8) DEFAULT 0,
  currency TEXT NOT NULL,
  flex_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('deposit', 'withdraw', 'stake_create', 'stake_yield', 'transfer')) NOT NULL,
  amount DECIMAL(20,8) NOT NULL,
  currency TEXT NOT NULL,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default staking plans
INSERT INTO staking_plans (name, days, apr, type) VALUES
('Flexible Staking', 0, 5.00, 'flexible'),
('30 Days Locked', 30, 8.00, 'locked'),
('60 Days Locked', 60, 12.00, 'locked'),
('90 Days Locked', 90, 18.00, 'locked')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own wallets" ON wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own wallets" ON wallets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wallets" ON wallets FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own stakes" ON stakes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stakes" ON stakes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'display_name');
  
  -- Initialize default wallets
  INSERT INTO wallets (user_id, currency, available) VALUES
  (NEW.id, 'USDT', 0),
  (NEW.id, 'BTC', 0),
  (NEW.id, 'ETH', 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 4. Test the Connection
1. Save your `.env.local` file
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. Check the browser console - you should see:
   ```
   Supabase URL: https://your-project-id.supabase.co
   Supabase Key: Present
   ```

### 5. Test Login/Registration
1. Go to your website
2. Try to register a new account
3. Try to login with existing credentials
4. Check if the errors are gone

## 🔍 Troubleshooting

### If you still get errors:
1. **Check your `.env.local` file** - make sure it's in the `version 0.3` folder
2. **Verify your Supabase URL** - should start with `https://` and end with `.supabase.co`
3. **Check your API key** - should be a long string starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
4. **Restart your server** after adding environment variables
5. **Check Supabase project status** - make sure it's not paused

### If you need help:
- Check the browser console for specific error messages
- Verify your Supabase project is active and not paused
- Make sure you're using the correct API keys (anon key, not service role key)

## 📱 For Production Deployment
When deploying to production (Vercel, Netlify, etc.), add these environment variables in your hosting platform's settings:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The mobile slider design is now fixed and working perfectly! The login issue is just a configuration problem that will be resolved once you set up Supabase properly.
