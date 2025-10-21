# 📊 Dashboard Testing Guide - Destiny Platform

## Overview

This guide helps you verify that the dashboard correctly displays real-time data from Supabase, including wallet balances, staking positions, and transaction history.

## Prerequisites

Before testing, ensure:
1. ✅ Database schema is set up
2. ✅ User has registered and received demo balances
3. ✅ Supabase connection is working
4. ✅ Real-time subscriptions are enabled
5. ✅ Crypto price API is accessible

## Dashboard Components to Test

### 1. Portfolio Overview

**Location:** Top section of dashboard
**Data Sources:** `wallets` table + crypto prices API

**Test Steps:**
1. Login to dashboard
2. Check total portfolio value calculation
3. Verify individual currency balances

**Expected Results:**
- ✅ Total portfolio value displays correctly
- ✅ Individual wallet balances show:
  - ETH: ~$800 (800 * current ETH price)
  - BTC: ~$500 (500 * current BTC price)
  - USDT: $400
  - BNB: ~$200 (200 * current BNB price)
  - MATIC: ~$100 (100 * current MATIC price)
- ✅ Values update in real-time when prices change

### 2. Crypto Cards

**Location:** Currency cards section
**Data Sources:** `wallets` table + crypto prices API

**Test Steps:**
1. Check each crypto card displays correct balance
2. Verify price formatting (2 decimal places)
3. Check percentage changes (24h)
4. Test card interactions (click to expand)

**Expected Results:**
- ✅ 5 crypto cards displayed (ETH, BTC, USDT, BNB, MATIC)
- ✅ Balances match database values
- ✅ Prices formatted correctly ($X,XXX.XX)
- ✅ Percentage changes show with proper colors (green/red)
- ✅ Cards are clickable and responsive

### 3. Portfolio Chart

**Location:** Chart section
**Data Sources:** Historical portfolio data

**Test Steps:**
1. Check chart loads without errors
2. Verify chart shows portfolio value over time
3. Test chart interactions (hover, zoom)

**Expected Results:**
- ✅ Chart renders without errors
- ✅ Shows portfolio value trend
- ✅ Interactive tooltips work
- ✅ Responsive design on mobile

### 4. Active Stakes

**Location:** Stakes section
**Data Sources:** `stakes` table + `plans` table

**Test Steps:**
1. Check if user has any active stakes
2. If no stakes, create a test stake
3. Verify stake details display correctly

**Expected Results:**
- ✅ Active stakes list displays correctly
- ✅ Shows stake amount, plan, APY, end date
- ✅ Progress bars show time remaining
- ✅ Yield calculations are accurate

### 5. Recent Transactions

**Location:** Activity section
**Data Sources:** `transactions` table

**Test Steps:**
1. Check recent transactions list
2. Verify transaction details
3. Test pagination if many transactions

**Expected Results:**
- ✅ Recent transactions display correctly
- ✅ Shows transaction type, amount, currency, date
- ✅ Proper icons for different transaction types
- ✅ Chronological order (newest first)

### 6. User Statistics

**Location:** Stats cards
**Data Sources:** Calculated from `wallets`, `stakes`, `transactions`

**Test Steps:**
1. Check total staked amount
2. Check total earned yield
3. Check referral count
4. Check transaction count

**Expected Results:**
- ✅ Total staked: Sum of all locked amounts
- ✅ Total earned: Sum of all yield transactions
- ✅ Referrals: Count from referrals table
- ✅ Transactions: Count from transactions table

## Real-Time Testing

### 1. Wallet Balance Updates

**Test Steps:**
1. Open dashboard in two browser tabs
2. Create a stake in one tab
3. Check if balance updates in real-time in other tab

**Expected Results:**
- ✅ Available balance decreases
- ✅ Locked balance increases
- ✅ Total portfolio value updates
- ✅ Changes appear within 1-2 seconds

### 2. Transaction Updates

**Test Steps:**
1. Perform a transaction (stake, transfer, etc.)
2. Check if transaction appears in activity feed
3. Verify transaction details are correct

**Expected Results:**
- ✅ New transaction appears immediately
- ✅ Transaction details are accurate
- ✅ Activity feed updates in real-time

### 3. Staking Updates

**Test Steps:**
1. Create a new stake
2. Check if stake appears in active stakes
3. Verify stake details are correct

**Expected Results:**
- ✅ New stake appears in active stakes
- ✅ Stake details match creation parameters
- ✅ Portfolio chart updates

## Data Accuracy Testing

### 1. Balance Calculations

**Test Steps:**
1. Manually calculate expected portfolio value
2. Compare with dashboard display
3. Check for rounding errors

**Expected Results:**
- ✅ Portfolio value matches manual calculation
- ✅ No significant rounding errors
- ✅ Currency conversions are accurate

### 2. Yield Calculations

**Test Steps:**
1. Create a stake with known APY
2. Wait for yield accrual
3. Verify yield calculations

**Expected Results:**
- ✅ Daily yield = (amount * APY) / 365
- ✅ Accumulated yield is accurate
- ✅ Yield transactions are recorded

### 3. Transaction History

**Test Steps:**
1. Perform various transactions
2. Check transaction history accuracy
3. Verify transaction metadata

**Expected Results:**
- ✅ All transactions are recorded
- ✅ Transaction details are accurate
- ✅ Metadata (stake_id, plan_name) is correct

## Performance Testing

### 1. Loading Speed

**Test Steps:**
1. Measure dashboard load time
2. Check for loading states
3. Test on slow connections

**Expected Results:**
- ✅ Dashboard loads within 3 seconds
- ✅ Loading skeletons display during fetch
- ✅ Graceful degradation on slow connections

### 2. Real-Time Performance

**Test Steps:**
1. Monitor WebSocket connections
2. Check for memory leaks
3. Test with multiple tabs open

**Expected Results:**
- ✅ WebSocket connections are stable
- ✅ No memory leaks detected
- ✅ Multiple tabs work correctly

### 3. Mobile Performance

**Test Steps:**
1. Test on mobile devices
2. Check touch interactions
3. Verify responsive design

**Expected Results:**
- ✅ Dashboard works on mobile
- ✅ Touch interactions are smooth
- ✅ Layout adapts to screen size

## Error Handling Testing

### 1. Network Errors

**Test Steps:**
1. Disconnect internet
2. Check error handling
3. Reconnect and verify recovery

**Expected Results:**
- ✅ Graceful error messages
- ✅ Retry mechanisms work
- ✅ Data recovers after reconnection

### 2. API Errors

**Test Steps:**
1. Simulate API failures
2. Check fallback behavior
3. Verify error messages

**Expected Results:**
- ✅ Clear error messages
- ✅ Fallback data displays
- ✅ User can retry operations

### 3. Database Errors

**Test Steps:**
1. Simulate database issues
2. Check error handling
3. Verify data consistency

**Expected Results:**
- ✅ Database errors are handled
- ✅ User sees appropriate messages
- ✅ Data remains consistent

## Browser Compatibility

### Test on Multiple Browsers:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Test on Multiple Devices:
- ✅ Desktop (1920x1080)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

## Common Issues & Solutions

### Issue: Dashboard Shows Loading Forever
**Cause:** Database connection issues
**Solution:** 
1. Check Supabase connection
2. Verify RLS policies
3. Check browser console for errors

### Issue: Balances Don't Update
**Cause:** Real-time subscriptions not working
**Solution:**
1. Check WebSocket connection
2. Verify real-time is enabled in Supabase
3. Check subscription setup

### Issue: Wrong Portfolio Value
**Cause:** Crypto price API issues
**Solution:**
1. Check price API connection
2. Verify price calculations
3. Check for API rate limits

### Issue: Transactions Not Appearing
**Cause:** Transaction queries failing
**Solution:**
1. Check transaction table permissions
2. Verify query syntax
3. Check for data consistency

## Success Criteria

Dashboard is working correctly when:
1. ✅ All data displays accurately
2. ✅ Real-time updates work
3. ✅ Performance meets targets
4. ✅ Error handling is graceful
5. ✅ Mobile experience is smooth
6. ✅ Cross-browser compatibility
7. ✅ Data calculations are accurate
8. ✅ User interactions work properly

## Next Steps

After dashboard testing is complete:
1. Test staking functionality
2. Test fund transfers
3. Test referral system
4. Test admin panel
5. Performance optimization

The dashboard is the heart of the user experience - ensure it's reliable and performant!

