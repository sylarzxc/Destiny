# Destiny Platform Testing Guide

## Overview
This guide covers testing all major functionality of the Destiny Platform crypto cabinet.

## Prerequisites
- Supabase project set up with enhanced schema
- Edge Functions deployed
- Admin user created
- Test users registered

## Test Scenarios

### 1. User Registration & Authentication
**Test Case 1.1: New User Registration**
- [ ] Navigate to registration page
- [ ] Fill in email and password
- [ ] Submit registration
- [ ] Verify user receives $2000 demo balance
- [ ] Check wallets are created for all currencies
- [ ] Verify referral code is generated

**Test Case 1.2: Login with Remember Me**
- [ ] Login with valid credentials
- [ ] Check "Remember me" checkbox
- [ ] Verify email is saved in localStorage
- [ ] Logout and verify email persists
- [ ] Login again and verify autofill works

**Test Case 1.3: Password Reset**
- [ ] Click "Forgot Password"
- [ ] Enter valid email
- [ ] Check email for reset link
- [ ] Follow reset link and set new password
- [ ] Login with new password

### 2. Dashboard Functionality
**Test Case 2.1: Dashboard Data Display**
- [ ] Login as regular user
- [ ] Verify dashboard shows real balance data
- [ ] Check crypto cards display correct amounts
- [ ] Verify portfolio chart renders
- [ ] Check recent transactions list

**Test Case 2.2: Real-time Updates**
- [ ] Open dashboard in two browser tabs
- [ ] Create a stake in one tab
- [ ] Verify dashboard updates in second tab
- [ ] Check animations work properly

### 3. Staking (Deposit) Functionality
**Test Case 3.1: Create Locked Stake**
- [ ] Navigate to Deposit page
- [ ] Select ETH currency
- [ ] Choose "ETH Locked 90" plan
- [ ] Enter amount (e.g., 100 ETH)
- [ ] Submit stake creation
- [ ] Verify funds move from available to locked
- [ ] Check stake appears in active stakes

**Test Case 3.2: Create Flexible Stake**
- [ ] Select USDT currency
- [ ] Choose "USDT Flexible Daily" plan
- [ ] Enter amount (e.g., 500 USDT)
- [ ] Submit stake creation
- [ ] Verify stake is created
- [ ] Check daily interest accrual

**Test Case 3.3: Insufficient Funds**
- [ ] Try to stake more than available balance
- [ ] Verify error message appears
- [ ] Check balance remains unchanged

**Test Case 3.4: Complete Stake**
- [ ] Navigate to active stakes
- [ ] Find completed stake (if any)
- [ ] Click "Withdraw" button
- [ ] Verify funds return to available balance
- [ ] Check transaction history updated

### 4. Fund Transfers (Send)
**Test Case 4.1: Send Funds to Another User**
- [ ] Navigate to Send page
- [ ] Enter recipient email (another test user)
- [ ] Select USDT currency
- [ ] Enter amount (e.g., 50 USDT)
- [ ] Add note (optional)
- [ ] Submit transfer
- [ ] Verify sender balance decreases
- [ ] Check recipient balance increases
- [ ] Verify transaction appears in both histories

**Test Case 4.2: Invalid Recipient**
- [ ] Try to send to non-existent email
- [ ] Verify error message
- [ ] Check balance unchanged

**Test Case 4.3: Insufficient Balance**
- [ ] Try to send more than available
- [ ] Verify error message
- [ ] Check balance unchanged

### 5. Referral System
**Test Case 5.1: Use Referral Code**
- [ ] Register new user with referral link
- [ ] Or manually enter referral code
- [ ] Verify bonus is credited to referrer
- [ ] Check referral relationship is created

**Test Case 5.2: Referral Dashboard**
- [ ] Login as user with referrals
- [ ] Navigate to Referrals page
- [ ] Verify referral stats display correctly
- [ ] Check referral link works
- [ ] Test copy/share functionality

### 6. Admin Panel Functionality
**Test Case 6.1: Admin Access**
- [ ] Login as admin user
- [ ] Verify admin sidebar appears
- [ ] Check admin dashboard loads
- [ ] Verify admin-only functions are accessible

**Test Case 6.2: Staking Plans Management**
- [ ] Navigate to Staking Pools
- [ ] Create new staking plan
- [ ] Edit existing plan
- [ ] Delete plan
- [ ] Verify changes reflect in user interface

**Test Case 6.3: User Management**
- [ ] Navigate to Users Management
- [ ] Search for specific user
- [ ] View user details
- [ ] Add funds to user wallet
- [ ] Change user role (admin/user)
- [ ] Verify changes take effect

**Test Case 6.4: Analytics Dashboard**
- [ ] Check total users count
- [ ] Verify total balance calculations
- [ ] Check active stakes count
- [ ] Verify referral statistics

### 7. Edge Functions Testing
**Test Case 7.1: Create Stake Function**
- [ ] Test stake creation via Edge Function
- [ ] Verify proper error handling
- [ ] Check authentication requirements

**Test Case 7.2: Transfer Funds Function**
- [ ] Test fund transfer via Edge Function
- [ ] Verify atomic transactions
- [ ] Check validation logic

**Test Case 7.3: Daily Interest Cron**
- [ ] Manually trigger interest accrual
- [ ] Verify calculations are correct
- [ ] Check flexible vs locked stake handling

### 8. Error Handling & Edge Cases
**Test Case 8.1: Network Errors**
- [ ] Disconnect internet during transaction
- [ ] Verify proper error messages
- [ ] Check data consistency

**Test Case 8.2: Invalid Input**
- [ ] Enter negative amounts
- [ ] Use invalid email formats
- [ ] Submit empty forms
- [ ] Verify validation works

**Test Case 8.3: Concurrent Operations**
- [ ] Open multiple tabs
- [ ] Perform simultaneous transactions
- [ ] Verify data consistency

### 9. Performance Testing
**Test Case 9.1: Large Data Sets**
- [ ] Create many stakes
- [ ] Generate many transactions
- [ ] Verify dashboard performance
- [ ] Check loading times

**Test Case 9.2: Real-time Updates**
- [ ] Monitor WebSocket connections
- [ ] Verify update frequency
- [ ] Check for memory leaks

### 10. Security Testing
**Test Case 10.1: Row Level Security**
- [ ] Try to access other users' data
- [ ] Verify RLS policies work
- [ ] Check admin vs user permissions

**Test Case 10.2: Input Validation**
- [ ] Test SQL injection attempts
- [ ] Verify XSS protection
- [ ] Check CSRF protection

## Test Data Setup

### Create Test Users
```sql
-- Create test users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES 
  ('test-user-1', 'test1@example.com', 'password', now()),
  ('test-user-2', 'test2@example.com', 'password', now()),
  ('test-admin', 'admin@example.com', 'password', now());
```

### Create Test Profiles
```sql
-- Create profiles for test users
INSERT INTO public.profiles (id, email, role)
VALUES 
  ('test-user-1', 'test1@example.com', 'user'),
  ('test-user-2', 'test2@example.com', 'user'),
  ('test-admin', 'admin@example.com', 'admin');
```

## Expected Results

### Success Criteria
- [ ] All test cases pass
- [ ] No data inconsistencies
- [ ] Proper error handling
- [ ] Good user experience
- [ ] Security policies enforced
- [ ] Real-time updates working
- [ ] Animations smooth
- [ ] Mobile responsive

### Performance Benchmarks
- Dashboard load time: < 2 seconds
- Transaction processing: < 1 second
- Real-time updates: < 500ms delay
- Mobile performance: Smooth scrolling

## Bug Reporting Template

**Bug Title:** [Brief description]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:** [What should happen]

**Actual Result:** [What actually happens]

**Environment:**
- Browser: [Chrome/Firefox/Safari]
- OS: [Windows/Mac/Linux]
- Device: [Desktop/Mobile]

**Screenshots:** [If applicable]

**Additional Notes:** [Any other relevant information]
