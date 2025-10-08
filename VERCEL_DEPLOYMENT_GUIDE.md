# Vercel Deployment Guide - Brain Link Tracker

## Overview
This guide explains how to deploy the Brain Link Tracker application to Vercel with Supabase as the database.

## Prerequisites
1. A Vercel account
2. A Supabase project (free tier is sufficient)
3. A Telegram Bot (optional, for notifications)
4. GitHub repository access

## Step 1: Supabase Setup

### 1.1 Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned (2-3 minutes)

### 1.2 Get Your Supabase Credentials
From your Supabase Dashboard:
1. Go to **Project Settings** > **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key**

3. Go to **Project Settings** > **Database**
4. Scroll down to **Connection string** > **URI**
5. Copy the **PostgreSQL connection string** (replace `[YOUR-PASSWORD]` with your database password)

### 1.3 Run Database Migrations
The database schema is already defined in `supabase/migrations/20251007032642_initial_enterprise_schema.sql`.

You can apply it either:
- Through Supabase Dashboard: **SQL Editor** > paste the migration file contents > **Run**
- OR through Supabase CLI (if installed): `supabase db push`

## Step 2: Environment Variables for Vercel

When deploying to Vercel, configure these environment variables in your Vercel project settings:

### Required Variables

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | `eyJhbGc...` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres` |
| `SECRET_KEY` | Flask secret key for sessions | Generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"` |

### Optional Variables

| Variable Name | Description | Required For |
|--------------|-------------|--------------|
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token from @BotFather | Telegram notifications |
| `TELEGRAM_CHAT_ID` | Your Telegram chat ID | Telegram notifications |

## Step 3: Vercel Deployment

### 3.1 Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** > **Project**
3. Import your GitHub repository
4. Vercel will auto-detect the framework settings

### 3.2 Configure Build Settings
Vercel should auto-configure based on `vercel.json`, but verify:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.3 Add Environment Variables
In Vercel project settings:
1. Go to **Settings** > **Environment Variables**
2. Add all the variables from Step 2 above
3. Make sure to add them for **Production**, **Preview**, and **Development** environments

### 3.4 Deploy
1. Click **Deploy**
2. Wait for the build to complete (2-5 minutes)
3. Visit your deployment URL

## Step 4: Post-Deployment Setup

### 4.1 Create Default Admin User
After first deployment, the system should auto-create a default admin user:
- **Username**: `Brain`
- **Password**: `Mayflower1!!`
- **Email**: `admin@brainlinktracker.com`
- **Role**: main_admin

**IMPORTANT**: Change this password immediately after first login!

### 4.2 Test the Application
1. Visit your Vercel URL
2. Log in with the default admin credentials
3. Navigate through all tabs to ensure functionality
4. Create a test tracking link
5. Test the tracking functionality

### 4.3 Configure Telegram Notifications (Optional)
1. Create a Telegram bot via @BotFather
2. Get your bot token
3. Get your chat ID (use @userinfobot)
4. Add these to Vercel environment variables
5. Test in **Settings** > **Telegram Integration**

## Step 5: Domain Configuration (Optional)

### 5.1 Add Custom Domain
1. In Vercel, go to **Settings** > **Domains**
2. Add your custom domain
3. Configure DNS records as instructed by Vercel
4. Wait for DNS propagation (5-60 minutes)

### 5.2 Update Tracking Links
After domain is configured, update your tracking links to use the custom domain for professional appearance.

## Troubleshooting

### Build Fails
- Check the Vercel build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Database Connection Issues
- Verify `DATABASE_URL` is correct and includes your password
- Check Supabase project is active and not paused
- Ensure IP address restrictions are not blocking Vercel

### API Routes Not Working
- Check Python dependencies are in `requirements.txt`
- Verify `api/index.py` is configured correctly
- Check Vercel function logs for errors

### Frontend Not Loading Data
- Open browser console to check for API errors
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly
- Check CORS settings in API responses

## Security Recommendations

1. **Change Default Passwords**: Immediately change all default admin passwords
2. **Enable 2FA**: Configure Supabase project with 2FA
3. **Restrict Database Access**: Use Supabase Row Level Security (already configured)
4. **Rotate Secrets**: Periodically rotate your `SECRET_KEY`
5. **Monitor Logs**: Regularly check Vercel and Supabase logs for suspicious activity
6. **HTTPS Only**: Ensure all tracking links use HTTPS
7. **Environment Variables**: Never commit secrets to your repository

## Maintenance

### Regular Updates
- Update npm dependencies monthly: `npm update`
- Check for security vulnerabilities: `npm audit`
- Update Python dependencies as needed

### Backups
- Supabase automatically backs up your database
- Export data regularly from **Database** > **Backups** in Supabase Dashboard

### Monitoring
- Set up Vercel Analytics to monitor traffic
- Configure Supabase alerts for database usage
- Monitor function execution times and errors

## Support

For issues related to:
- **Vercel**: Check [Vercel Documentation](https://vercel.com/docs)
- **Supabase**: Check [Supabase Documentation](https://supabase.com/docs)
- **Application**: Check the repository's GitHub Issues

## Next Steps

After successful deployment:
1. Configure user approval workflows in Admin Panel
2. Set up Telegram notifications for real-time alerts
3. Create your first campaign and tracking links
4. Monitor analytics and optimize performance
5. Consider upgrading Supabase/Vercel plans based on usage

---

**Last Updated**: October 2025
**Application Version**: 1.0.0
**Deployment Platform**: Vercel + Supabase
