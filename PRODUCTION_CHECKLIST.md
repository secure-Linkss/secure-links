# Production Deployment Checklist

## Pre-Deployment

### 1. Environment Setup ✅
- [x] `.env.example` file created with all required variables
- [x] `.env` added to `.gitignore`
- [x] Supabase client installed and configured
- [ ] Actual Supabase credentials obtained from dashboard
- [ ] Database migration applied to Supabase

### 2. Database Configuration
- [ ] Create Supabase project
- [ ] Copy Project URL from Supabase Dashboard
- [ ] Copy Anon Key from Supabase Dashboard
- [ ] Get PostgreSQL connection string
- [ ] Apply migration: `supabase/migrations/20251007032642_initial_enterprise_schema.sql`
- [ ] Verify all tables are created
- [ ] Check Row Level Security policies are active

### 3. Required Environment Variables

#### Supabase (Required)
- [ ] `VITE_SUPABASE_URL` - Get from Supabase Dashboard > Settings > API
- [ ] `VITE_SUPABASE_ANON_KEY` - Get from Supabase Dashboard > Settings > API
- [ ] `DATABASE_URL` - Get from Supabase Dashboard > Settings > Database

#### Application (Required)
- [ ] `SECRET_KEY` - Generate: `python -c "import secrets; print(secrets.token_urlsafe(32))"`

#### Optional Features
- [ ] `TELEGRAM_BOT_TOKEN` - For Telegram notifications
- [ ] `TELEGRAM_CHAT_ID` - For Telegram notifications

### 4. Vercel Configuration
- [ ] Connect GitHub repository to Vercel
- [ ] Set Framework Preset to "Vite"
- [ ] Verify Build Command: `npm run build`
- [ ] Verify Output Directory: `dist`
- [ ] Add all environment variables in Vercel Dashboard
- [ ] Enable environment variables for Production, Preview, and Development

### 5. Code Verification ✅
- [x] Production build passes (`npm run build`)
- [x] No TypeScript errors
- [x] All dependencies in package.json
- [x] Python dependencies in requirements.txt
- [x] vercel.json configured correctly

## Post-Deployment

### 1. Initial Setup
- [ ] Visit deployed URL
- [ ] Verify site loads without errors
- [ ] Check browser console for errors

### 2. Authentication Testing
- [ ] Login with default admin:
  - Username: `Brain`
  - Password: `Mayflower1!!`
  - Email: `admin@brainlinktracker.com`
- [ ] Verify login successful
- [ ] **IMMEDIATELY change default password**
- [ ] Create a test user account
- [ ] Test user registration flow

### 3. Functionality Testing

#### Dashboard
- [ ] Verify dashboard loads
- [ ] Check all metrics display correctly
- [ ] Test date range selector
- [ ] Verify charts render properly
- [ ] Check mobile responsiveness

#### Tracking Links
- [ ] Create a new tracking link
- [ ] Verify short code generation
- [ ] Test link editing
- [ ] Test link deletion
- [ ] Verify campaign association works

#### Live Activity
- [ ] Check live activity feed loads
- [ ] Verify auto-refresh works
- [ ] Test search functionality
- [ ] Test event filtering

#### Campaign Management
- [ ] Create a new campaign
- [ ] Associate links with campaign
- [ ] Edit campaign details
- [ ] View campaign analytics
- [ ] Delete campaign

#### Analytics
- [ ] Verify analytics data loads
- [ ] Check device breakdown
- [ ] Test date range filtering
- [ ] Verify country data displays
- [ ] Test export functionality

#### Geography
- [ ] Verify interactive map displays
- [ ] Check country data loads
- [ ] Test city data display
- [ ] Click on countries to see details
- [ ] Test export functionality
- [ ] Verify mobile responsiveness

#### Security
- [ ] Access security settings
- [ ] Test security configurations
- [ ] Verify blocked IPs functionality

#### Settings
- [ ] Update user profile
- [ ] Test Telegram integration
- [ ] Change theme/appearance settings
- [ ] Update notification preferences

#### Link Shortener
- [ ] Create shortened links
- [ ] Test link functionality
- [ ] Verify redirect works

#### Admin Panel (Admin/Main Admin only)
- [ ] Access admin panel
- [ ] View all users
- [ ] Approve pending user
- [ ] Suspend a user
- [ ] View audit logs
- [ ] Export audit logs
- [ ] Test campaign management
- [ ] Verify security monitoring

### 4. API Endpoint Testing
- [ ] `/api/auth/login` - Authentication works
- [ ] `/api/auth/register` - Registration works
- [ ] `/api/analytics/dashboard` - Dashboard data loads
- [ ] `/api/analytics/countries` - Geography data loads
- [ ] `/api/events` - Live activity loads
- [ ] `/api/links` - Links CRUD works
- [ ] `/api/campaigns` - Campaigns CRUD works
- [ ] `/api/track/` - Link tracking works

### 5. Mobile Testing
- [ ] Test on mobile device (or Chrome DevTools mobile view)
- [ ] Verify all pages are responsive
- [ ] Check navigation works on mobile
- [ ] Test forms on mobile
- [ ] Verify tables scroll horizontally
- [ ] Check charts render properly on small screens

### 6. Performance Testing
- [ ] Run Lighthouse audit
- [ ] Check page load times
- [ ] Verify API response times
- [ ] Test with multiple concurrent users
- [ ] Monitor database query performance

### 7. Security Verification
- [ ] Default admin password changed
- [ ] HTTPS enabled (Vercel handles this)
- [ ] Check CORS headers
- [ ] Verify JWT tokens working
- [ ] Test RLS policies in Supabase
- [ ] Verify user roles enforced
- [ ] Test SQL injection protection
- [ ] Check XSS protection

### 8. Monitoring Setup
- [ ] Enable Vercel Analytics
- [ ] Configure Supabase monitoring
- [ ] Set up error tracking (optional: Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up backup schedule

### 9. Telegram Notifications (Optional)
- [ ] Create Telegram bot via @BotFather
- [ ] Get bot token
- [ ] Get chat ID via @userinfobot
- [ ] Add credentials to Vercel environment variables
- [ ] Test notification sending from Settings page
- [ ] Verify notifications received

### 10. Documentation
- [x] VERCEL_DEPLOYMENT_GUIDE.md created
- [x] PRODUCTION_CHECKLIST.md created
- [x] .env.example with all variables
- [ ] Update README.md with deployment info
- [ ] Document custom domain setup (if applicable)

## Common Issues & Solutions

### Build Fails
**Issue**: Build fails in Vercel
**Solution**:
- Check build logs for specific errors
- Verify all dependencies in package.json
- Ensure Node.js version compatibility
- Check for missing environment variables

### Database Connection Errors
**Issue**: Cannot connect to database
**Solution**:
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Ensure password is correct in connection string
- Check IP restrictions in Supabase settings

### API Routes Return 404
**Issue**: API endpoints not found
**Solution**:
- Verify vercel.json is in root directory
- Check Python dependencies in requirements.txt
- Ensure api/index.py exists and is configured
- Check Vercel function logs

### Authentication Not Working
**Issue**: Cannot login
**Solution**:
- Verify SECRET_KEY is set in Vercel
- Check database connection
- Verify default admin user was created
- Check browser console for errors

### No Data Showing
**Issue**: Dashboard/Analytics empty
**Solution**:
- Create test tracking links first
- Generate test traffic by clicking links
- Wait a few seconds for data to propagate
- Check API endpoints are returning data

### Telegram Notifications Not Working
**Issue**: Notifications not received
**Solution**:
- Verify bot token is correct
- Check chat ID is correct
- Ensure bot is started (send /start to bot)
- Test from Settings page
- Check Vercel function logs

## Final Verification

Before marking as production-ready:
- [ ] All checkboxes above are completed
- [ ] No console errors in browser
- [ ] All major features tested
- [ ] Default passwords changed
- [ ] Documentation updated
- [ ] Backups configured
- [ ] Monitoring enabled

## Success Criteria

✅ **Production Ready** when:
1. Site loads without errors
2. Authentication works
3. Users can create and track links
4. Analytics display correctly
5. Admin panel accessible (for admin users)
6. Mobile responsive
7. All API endpoints functional
8. Database properly configured
9. Security measures in place
10. Documentation complete

---

**Note**: This checklist should be completed for EVERY production deployment. Keep a copy for future reference and updates.

**Last Updated**: October 2025
**Version**: 1.0.0
