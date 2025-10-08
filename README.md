# Brain Link Tracker - Advanced Link Tracking SaaS Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)

## 🚀 Overview

Brain Link Tracker is a comprehensive SaaS platform for link tracking, URL shortening, and advanced analytics. Built with React, Flask, and Supabase, it provides real-time tracking, geographic analytics, campaign management, and enterprise-grade admin features.

### ✨ Key Features

- **🔗 Link Tracking**: Create and manage tracking links with detailed analytics
- **📊 Real-Time Analytics**: Live dashboard with clicks, visitors, conversions
- **🌍 Geographic Insights**: Interactive world map with country/city breakdowns
- **📱 Device Analytics**: Track desktop, mobile, and tablet usage
- **🎯 Campaign Management**: Organize links into campaigns for better tracking
- **⚡ Live Activity**: Real-time feed of all tracking events
- **🛡️ Security Features**: Bot detection, IP blocking, threat monitoring
- **👥 User Management**: Role-based access control (Main Admin, Admin, Member)
- **📲 URL Shortener**: Built-in link shortening functionality
- **🔔 Telegram Notifications**: Real-time alerts via Telegram bot
- **🎨 Modern UI**: Dark theme with glassmorphism design
- **📱 Mobile Responsive**: Fully responsive across all devices

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Recharts** - Data visualization
- **React Router** - Client-side routing
- **Framer Motion** - Animations

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - ORM for database operations
- **JWT** - Token-based authentication
- **Supabase** - PostgreSQL database with real-time features

### Deployment
- **Vercel** - Hosting and serverless functions
- **Supabase** - Managed PostgreSQL database
- **GitHub** - Version control

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher
- **Python** 3.9 or higher
- **npm** or **pnpm**
- **Vercel Account** (free tier works)
- **Supabase Account** (free tier works)
- **GitHub Account**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/secure-Linkss/bol.new.git
cd bol.new
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database Configuration
DATABASE_URL=your_supabase_database_url

# Application Secret
SECRET_KEY=your_secret_key_here

# Optional: Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

### 4. Set Up Supabase Database

1. Create a new project on [Supabase](https://supabase.com)
2. Go to SQL Editor in your Supabase Dashboard
3. Copy the contents of `supabase/migrations/20251007032642_initial_enterprise_schema.sql`
4. Paste and run in SQL Editor
5. Verify all tables are created

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

### 6. Default Admin Login

```
Username: Brain
Password: Mayflower1!!
Email: admin@brainlinktracker.com
```

**⚠️ IMPORTANT**: Change this password immediately after first login!

## 📦 Project Structure

```
bol.new/
├── api/                      # Python Flask API
│   └── index.py             # Main API entry point
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── TrackingLinks.jsx
│   │   ├── LiveActivity.jsx
│   │   ├── Campaign.jsx
│   │   ├── Analytics.jsx
│   │   ├── Geography.jsx
│   │   ├── Security.jsx
│   │   ├── Settings.jsx
│   │   ├── LinkShortener.jsx
│   │   ├── AdminPanel.jsx
│   │   └── ui/              # Reusable UI components
│   ├── lib/                 # Utility libraries
│   │   └── supabase.js      # Supabase client config
│   ├── routes/              # Backend API routes
│   ├── models/              # Database models
│   ├── services/            # Business logic
│   └── App.jsx              # Main React app
├── supabase/
│   └── migrations/          # Database migrations
├── dist/                    # Production build output
├── vercel.json              # Vercel configuration
├── package.json             # Node dependencies
├── requirements.txt         # Python dependencies
├── .env.example             # Environment variables template
├── VERCEL_DEPLOYMENT_GUIDE.md
├── PRODUCTION_CHECKLIST.md
└── README.md
```

## 🌐 Deployment to Vercel

### Option 1: Automatic Deployment (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Click **Add New** > **Project**
4. Import your GitHub repository
5. Add environment variables (see `.env.example`)
6. Click **Deploy**

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Configure Environment Variables in Vercel

1. Go to your project in Vercel
2. Navigate to **Settings** > **Environment Variables**
3. Add all variables from `.env.example`
4. Redeploy if needed

**📖 Detailed Guide**: See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

## 📊 Features Overview

### Dashboard
- Real-time metrics (clicks, visitors, emails, conversion rate)
- Interactive charts and graphs
- Device breakdown (Desktop, Mobile, Tablet)
- Performance trends over time
- Top campaigns overview

### Tracking Links
- Create unlimited tracking links
- Custom short codes
- Campaign association
- Geographic targeting
- Device targeting
- Bot detection settings
- Link status management (active/paused)
- Bulk operations

### Live Activity
- Real-time event feed
- Auto-refresh every 5 seconds
- Event filtering and search
- Detailed event information
- Device and location tracking
- Status indicators

### Campaign Management
- Organize links into campaigns
- Campaign-level analytics
- Performance comparison
- Campaign status tracking
- Export campaign data

### Analytics
- Comprehensive dashboard statistics
- Country and device breakdowns
- Email capture tracking
- Conversion rate analysis
- Custom date ranges
- Data export (CSV)

### Geography
- Interactive world map visualization
- Country-level traffic analysis
- City-level insights
- Traffic intensity heat map
- Geographic filtering
- Export geographic data

### Security
- Bot detection and blocking
- IP address blocking
- Proxy detection
- Threat monitoring
- Security event logging
- Configurable security rules

### Admin Panel
- User management (approve, suspend, delete)
- Role-based access control
- Subscription management
- Audit log viewing
- System-wide statistics
- Bulk operations
- Export audit logs

### Link Shortener
- Quick URL shortening
- Custom short codes
- QR code generation
- Link preview
- Analytics integration

### Settings
- User profile management
- Telegram bot integration
- Theme customization
- Notification preferences
- Security settings
- API key management

## 🔒 Security Features

- **Row Level Security (RLS)**: Enforced at database level
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Bcrypt encryption
- **HTTPS Only**: All traffic encrypted (Vercel default)
- **CORS Protection**: Configured origins
- **Rate Limiting**: API request limits
- **Bot Detection**: Automated bot blocking
- **IP Blocking**: Manual and automatic IP bans
- **Audit Logging**: All admin actions tracked

## 👥 User Roles

### Main Admin
- Full system access
- User management (approve, suspend, delete)
- System configuration
- All analytics and reports
- Audit log access
- Danger zone operations

### Assistant Admin
- User viewing
- Campaign management
- Analytics access
- Support ticket handling
- Limited system config

### Member (Regular User)
- Create and manage own links
- View own analytics
- Campaign management
- Profile settings
- Create support tickets

## 🔔 Telegram Integration

### Setup Instructions

1. **Create a Bot**:
   - Open Telegram and search for @BotFather
   - Send `/newbot` and follow prompts
   - Copy the bot token

2. **Get Chat ID**:
   - Send a message to your bot
   - Visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find your chat ID in the response

3. **Configure**:
   - Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` to `.env`
   - Redeploy on Vercel
   - Test in Settings > Telegram Integration

### Notification Types
- New user registrations
- Link creation
- High traffic alerts
- Security threats
- System events
- Custom alerts

## 📱 Mobile Responsiveness

All pages are fully responsive and tested on:
- iPhone (Safari)
- Android (Chrome)
- iPad (Safari)
- Tablets (Chrome)
- Desktop (All modern browsers)

## 🧪 Testing

### Run Tests
```bash
# Frontend tests
npm test

# Backend tests
python -m pytest
```

### Manual Testing
See [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) for comprehensive testing checklist.

## 🐛 Troubleshooting

### Build Fails
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`
- Verify all dependencies: `npm list`

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check Supabase project status
- Ensure database migration ran successfully

### API Not Working
- Check Vercel function logs
- Verify environment variables are set
- Test API endpoints directly

### No Data Showing
- Create test tracking links
- Generate test clicks
- Check API responses in Network tab

## 📖 Documentation

- [Deployment Guide](./VERCEL_DEPLOYMENT_GUIDE.md) - Comprehensive deployment instructions
- [Production Checklist](./PRODUCTION_CHECKLIST.md) - Pre-deployment verification
- [Project Status](./PROJECT_STATUS.md) - Development progress overview
- [Implementation Roadmap](./IMPLEMENTATION_ROADMAP.md) - Development plan

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Backend infrastructure
- [Vercel](https://vercel.com) - Hosting platform
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com) - Styling framework
- [Recharts](https://recharts.org) - Chart library

## 📞 Support

For issues and questions:
- GitHub Issues: [Report a bug](https://github.com/secure-Linkss/bol.new/issues)
- Documentation: Check the docs folder
- Email: support@brainlinktracker.com

## 🔄 Updates & Maintenance

### Current Version: 1.0.0

### Recent Updates
- ✅ Complete Supabase integration
- ✅ Interactive Geography map
- ✅ Mobile-responsive design
- ✅ Production-ready build
- ✅ Comprehensive documentation

### Planned Features
- Real-time WebSocket updates
- Advanced bot detection
- A/B testing functionality
- Email campaign integration
- Webhook support
- API v2 with better documentation
- Multi-language support

---

**Built with ❤️ by the Brain Link Tracker Team**

**Last Updated**: October 2025
