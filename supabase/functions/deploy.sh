#!/bin/bash

# Supabase Edge Functions Deployment Script
# This script deploys all Edge Functions to Supabase

set -e

echo "🚀 Deploying Supabase Edge Functions..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if user is logged in
if ! supabase status &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please run:"
    echo "supabase login"
    exit 1
fi

# Deploy all functions
echo "📦 Deploying functions..."

# Deploy calculate-staking-yields
echo "  📊 Deploying calculate-staking-yields..."
supabase functions deploy calculate-staking-yields

# Deploy create-stake
echo "  🔒 Deploying create-stake..."
supabase functions deploy create-stake

# Deploy complete-stake
echo "  ✅ Deploying complete-stake..."
supabase functions deploy complete-stake

# Deploy transfer-funds
echo "  💸 Deploying transfer-funds..."
supabase functions deploy transfer-funds

# Deploy use-referral-code
echo "  🎯 Deploying use-referral-code..."
supabase functions deploy use-referral-code

# Deploy daily-interest-cron
echo "  ⏰ Deploying daily-interest-cron..."
supabase functions deploy daily-interest-cron

echo "✅ All functions deployed successfully!"

# Set up cron job for daily interest accrual
echo "⏰ Setting up cron job for daily interest accrual..."
supabase functions deploy daily-interest-cron --no-verify-jwt

echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure cron job in Supabase Dashboard"
echo "2. Set up environment variables if needed"
echo "3. Test the functions"
echo ""
echo "🔗 Useful links:"
echo "- Supabase Dashboard: https://supabase.com/dashboard"
echo "- Functions Logs: https://supabase.com/dashboard/project/[PROJECT_ID]/functions"
echo "- Cron Jobs: https://supabase.com/dashboard/project/[PROJECT_ID]/functions/cron"
