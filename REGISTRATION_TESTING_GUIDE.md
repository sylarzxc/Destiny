# 🧪 Registration Flow Testing Guide - Destiny Platform

## Overview

This guide helps you test the complete user registration flow to ensure new users receive their $2000 demo balance correctly.

## Prerequisites

Before testing, ensure:
1. ✅ Database schema is set up (run `sql-enhanced.bd`)
2. ✅ Supabase connection is working
3. ✅ `handle_new_user()` trigger is active
4. ✅ Development server is running

## Test Scenarios

### 1. Basic Registration Test

**Steps:**
1. Go to `/register` page
2. Fill out the registration form:
   - **Email**: `test@example.com`
   - **Display Name**: `Test User`
   - **Password**: `Test123456`
   - **Confirm Password**: `Test123456`
3. Click "Create Account"
4. Check email for verification (if email confirmation is enabled)

**Expected Results:**
- ✅ User account created successfully
- ✅ Profile created in `profiles` table
- ✅ 5 wallets created in `wallets` table with demo balances:
  - ETH: 800
  - BTC: 500
  - USDT: 400
  - BNB: 200
  - MATIC: 100
- ✅ Unique referral code generated (8 characters)
- ✅ User redirected to dashboard

### 2. Registration with Referral Code

**Steps:**
1. Get a referral code from an existing user
2. Go to `/register?ref=REFERRAL_CODE`
3. Complete registration as above

**Expected Results:**
- ✅ All basic registration results
- ✅ Referral code stored in localStorage
- ✅ Referral relationship created in `referrals` table
- ✅ Referrer receives $200 USDT bonus

### 3. Duplicate Email Test

**Steps:**
1. Try to register with an email that already exists
2. Complete registration form

**Expected Results:**
- ❌ Registration fails with "User already registered" error
- ❌ No new profile or wallets created

### 4. Invalid Input Test

**Steps:**
1. Test various invalid inputs:
   - Invalid email format
   - Short display name (< 2 characters)
   - Weak password
   - Mismatched passwords

**Expected Results:**
- ❌ Form validation errors shown
- ❌ Registration blocked until valid input

## Database Verification

### Check Profile Creation
```sql
SELECT * FROM profiles 
WHERE email = 'test@example.com';
```

**Expected:**
- `id`: UUID matching auth.users
- `email`: `test@example.com`
- `display_name`: `Test User`
- `role`: `user`
- `referral_code`: 8-character string
- `created_at`: Recent timestamp

### Check Wallet Creation
```sql
SELECT * FROM wallets 
WHERE user_id = (SELECT id FROM profiles WHERE email = 'test@example.com')
ORDER BY currency;
```

**Expected:**
- 5 rows (ETH, BTC, USDT, BNB, MATIC)
- `available` amounts: 800, 500, 400, 200, 100
- `locked`: 0 for all currencies
- `updated_at`: Recent timestamp

### Check Referral Code Uniqueness
```sql
SELECT referral_code, COUNT(*) 
FROM profiles 
GROUP BY referral_code 
HAVING COUNT(*) > 1;
```

**Expected:**
- No results (all referral codes should be unique)

## Frontend Testing

### Dashboard Verification
After successful registration:

1. **Check Portfolio Value**
   - Should show total portfolio value
   - Should calculate based on current crypto prices

2. **Check Wallet Balances**
   - ETH: ~$800 (based on current ETH price)
   - BTC: ~$500 (based on current BTC price)
   - USDT: $400
   - BNB: ~$200 (based on current BNB price)
   - MATIC: ~$100 (based on current MATIC price)

3. **Check Referral Code Display**
   - Should show unique referral code
   - Should be copyable
   - Should generate shareable link

### Mobile Testing
Test registration on mobile devices:
1. ✅ Form fields are properly sized
2. ✅ Keyboard doesn't zoom the page
3. ✅ Touch targets are adequate (44px minimum)
4. ✅ Form validation works on mobile

## Error Scenarios

### Network Issues
**Test:** Disconnect internet during registration
**Expected:** Graceful error handling, retry option

### Database Errors
**Test:** Temporarily disable database access
**Expected:** Clear error message, fallback behavior

### Supabase Service Issues
**Test:** Use invalid Supabase credentials
**Expected:** Connection error, helpful error message

## Performance Testing

### Registration Speed
- **Target:** Registration completes within 3 seconds
- **Test:** Time from form submission to dashboard redirect

### Database Performance
- **Target:** Profile and wallet creation within 1 second
- **Test:** Monitor database query execution time

## Automated Testing

### Unit Tests
Test individual components:
```bash
# Test registration form validation
npm test -- RegisterForm.test.tsx

# Test auth context
npm test -- AuthContext.test.tsx
```

### Integration Tests
Test complete registration flow:
```bash
# Test end-to-end registration
npm test -- registration.e2e.test.tsx
```

## Common Issues & Solutions

### Issue: No Demo Balances Created
**Cause:** `handle_new_user()` trigger not working
**Solution:** 
1. Check trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
2. Re-run trigger creation from `sql-enhanced.bd`

### Issue: Duplicate Referral Codes
**Cause:** Race condition in code generation
**Solution:** Check trigger logic for uniqueness validation

### Issue: Registration Hangs
**Cause:** Database timeout or network issues
**Solution:** 
1. Check Supabase connection
2. Verify database is accessible
3. Check browser console for errors

### Issue: Invalid Wallet Amounts
**Cause:** Wrong amounts in trigger
**Solution:** Update trigger with correct amounts:
- ETH: 800
- BTC: 500
- USDT: 400
- BNB: 200
- MATIC: 100

## Success Criteria

Registration flow is working correctly when:
1. ✅ New users can register successfully
2. ✅ Demo balances are created automatically
3. ✅ Referral codes are unique and generated
4. ✅ Referral system works (if tested)
5. ✅ Form validation prevents invalid input
6. ✅ Mobile experience is smooth
7. ✅ Error handling is graceful
8. ✅ Performance meets targets

## Next Steps

After registration testing is complete:
1. Test dashboard data display
2. Test staking functionality
3. Test fund transfers
4. Test referral system
5. Test admin panel

The registration flow is the foundation of the user experience - make sure it's rock solid!

