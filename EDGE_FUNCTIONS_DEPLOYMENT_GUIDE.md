# 🚀 Edge Functions Deployment Guide - Destiny Platform

## Prerequisites

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Login to Supabase
```bash
supabase login
```

### 3. Link to Your Project
```bash
cd "version 0.3"
supabase link --project-ref cwzcxjvjxxepkilfnrwu
```

## Edge Functions Overview

We have **6 Edge Functions** to deploy:

### 1. **create-stake** 
- **Purpose**: Create new staking positions
- **Security**: Validates user authentication and balance
- **Features**: Multi-currency support, plan validation

### 2. **complete-stake**
- **Purpose**: Withdraw completed stakes
- **Security**: Validates stake ownership and lock period
- **Features**: Yield calculation, balance updates

### 3. **transfer-funds**
- **Purpose**: Transfer funds between users
- **Security**: Email-based recipient lookup
- **Features**: Multi-currency transfers, transaction logging

### 4. **use-referral-code**
- **Purpose**: Apply referral codes for bonuses
- **Security**: Validates referral code and prevents self-referral
- **Features**: $200 USDT bonus, referral tracking

### 5. **calculate-staking-yields**
- **Purpose**: Calculate daily interest for all stakes
- **Security**: Admin-only function
- **Features**: Batch processing, yield distribution

### 6. **daily-interest-cron**
- **Purpose**: Automated daily interest accrual
- **Security**: Cron job authentication
- **Features**: Scheduled execution, error handling

## Deployment Methods

### Method 1: Automated Script (Recommended)
```bash
cd "version 0.3/supabase/functions"
chmod +x deploy.sh
./deploy.sh
```

### Method 2: Manual Deployment
```bash
cd "version 0.3"

# Deploy each function individually
supabase functions deploy create-stake
supabase functions deploy complete-stake
supabase functions deploy transfer-funds
supabase functions deploy use-referral-code
supabase functions deploy calculate-staking-yields
supabase functions deploy daily-interest-cron
```

## Post-Deployment Configuration

### 1. Set Up Cron Job
1. Go to Supabase Dashboard → Functions → Cron
2. Create new cron job:
   - **Function**: `daily-interest-cron`
   - **Schedule**: `0 0 * * *` (daily at midnight UTC)
   - **Timezone**: UTC

### 2. Verify Function URLs
After deployment, you'll get URLs like:
```
https://cwzcxjvjxxepkilfnrwu.supabase.co/functions/v1/create-stake
https://cwzcxjvjxxepkilfnrwu.supabase.co/functions/v1/complete-stake
https://cwzcxjvjxxepkilfnrwu.supabase.co/functions/v1/transfer-funds
https://cwzcxjvjxxepkilfnrwu.supabase.co/functions/v1/use-referral-code
https://cwzcxjvjxxepkilfnrwu.supabase.co/functions/v1/calculate-staking-yields
https://cwzcxjvjxxepkilfnrwu.supabase.co/functions/v1/daily-interest-cron
```

### 3. Test Functions
Test each function using the Supabase Dashboard:
1. Go to Functions → [Function Name] → Test
2. Use the provided test payloads
3. Verify responses and logs

## Function Details

### create-stake
**Endpoint**: `POST /functions/v1/create-stake`
**Payload**:
```json
{
  "plan_id": 1,
  "amount": 100,
  "currency": "USDT",
  "flex_days": null
}
```

### complete-stake
**Endpoint**: `POST /functions/v1/complete-stake`
**Payload**:
```json
{
  "stake_id": 1
}
```

### transfer-funds
**Endpoint**: `POST /functions/v1/transfer-funds`
**Payload**:
```json
{
  "to_user_email": "recipient@example.com",
  "amount": 50,
  "currency": "USDT",
  "note": "Payment for services"
}
```

### use-referral-code
**Endpoint**: `POST /functions/v1/use-referral-code`
**Payload**:
```json
{
  "referral_code": "ABC12345"
}
```

### calculate-staking-yields
**Endpoint**: `POST /functions/v1/calculate-staking-yields`
**Payload**: `{}` (no parameters needed)

### daily-interest-cron
**Endpoint**: `POST /functions/v1/daily-interest-cron`
**Payload**: `{}` (cron job calls automatically)

## Security Features

### Authentication
- All functions validate JWT tokens
- User context is extracted from token
- Admin functions check user role

### Input Validation
- Amount validation (must be > 0)
- Currency validation (ETH, BTC, USDT, BNB, MATIC)
- Plan validation (exists and matches currency)

### Database Security
- Uses Row Level Security (RLS)
- Functions run with `security definer`
- All operations are atomic

## Error Handling

### Common Errors
- `401 Unauthorized`: Invalid or missing JWT token
- `400 Bad Request`: Invalid input parameters
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource doesn't exist
- `500 Internal Server Error`: Database or system error

### Error Response Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional details"
}
```

## Monitoring & Logs

### View Logs
1. Go to Supabase Dashboard → Functions → [Function Name] → Logs
2. Filter by date, status, or user
3. View detailed error messages and execution times

### Metrics
- Function invocations
- Execution duration
- Error rates
- Memory usage

## Troubleshooting

### Deployment Issues
- **Permission denied**: Run `supabase login` again
- **Project not found**: Verify project reference ID
- **Function timeout**: Check function complexity and database queries

### Runtime Issues
- **Database errors**: Check RLS policies and table permissions
- **Authentication errors**: Verify JWT token format
- **Cron job not running**: Check cron configuration and timezone

## Success Indicators

After successful deployment:
1. ✅ All 6 functions deployed without errors
2. ✅ Function URLs accessible
3. ✅ Test calls return expected responses
4. ✅ Cron job scheduled and running
5. ✅ Logs show successful executions

## Next Steps

Once Edge Functions are deployed:
1. Test registration flow with demo balance
2. Test staking creation and withdrawal
3. Test fund transfers between users
4. Test referral system
5. Verify admin panel functionality

The Edge Functions provide the secure backend logic for all platform operations!

