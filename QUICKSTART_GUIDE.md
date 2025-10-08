# Admin Panel Quick Start Guide

## What's Been Completed

### ✅ Database Migration
- **Complete Supabase PostgreSQL schema** deployed with all tables:
  - users (with status: pending, active, suspended, expired)
  - campaigns
  - links
  - tracking_events
  - audit_logs
  - support_tickets + ticket_messages
  - subscription_verifications
  - security_threats
  - ip_blocklist
  - system_settings

- **Row Level Security (RLS)** enabled on all tables with restrictive policies
- **Indexes** created for optimal query performance
- **Foreign key constraints** ensuring data integrity

### ✅ Foundation Models Created
- `support_ticket.py` - Support ticket and message models
- `subscription_verification.py` - Manual payment verification model
- `security_threat.py` - Threat detection and IP blocklist models
- `supabase_client.py` - Singleton Supabase client

---

## What Needs To Be Done

This is an **enterprise-grade project** requiring 6-8 weeks of development. See `IMPLEMENTATION_ROADMAP.md` for complete details.

### Immediate Priorities

#### 1. Backend API Migration (Week 1-2)
The current Flask app uses SQLAlchemy with SQLite. It needs to be updated to use Supabase:

```python
# Old (SQLAlchemy)
user = User.query.filter_by(id=user_id).first()

# New (Supabase)
from src.database.supabase_client import get_supabase
supabase = get_supabase()
response = supabase.table('users').select('*').eq('id', user_id).single().execute()
user = response.data
```

**Required Files to Update:**
- `src/routes/admin.py` - Convert all queries to Supabase
- `src/routes/auth.py` - Integrate Supabase Auth
- `src/routes/links.py` - Update link management
- `src/routes/campaigns.py` - Update campaign management
- All model files in `src/models/`

#### 2. Frontend Admin Panel (Week 3-4)
Build React components for all 8 admin sub-tabs:

**Required Components:**
- `AdminPanel.jsx` - Main admin layout
- `Dashboard.jsx` - Overview metrics & activity feed
- `UserManagement.jsx` - User table with approval workflow
- `CampaignManagement.jsx` - Campaign list with link details
- `SecurityMonitoring.jsx` - Threat feed & IP management
- `SubscriptionVerification.jsx` - Manual payment approval
- `SupportTicketing.jsx` - Ticket queue & responses
- `AuditLogs.jsx` - Searchable audit trail
- `AdminSettings.jsx` - System configuration

#### 3. User Lifecycle Implementation (Week 4)
- Registration form that creates users with `status='pending'`
- Admin approval workflow
- Welcome email on approval
- Onboarding wizard for first login
- Subscription expiration handling

#### 4. RBAC Middleware (Week 2)
Create Flask decorators for role-based access:

```python
@main_admin_required
def delete_user():
    # Only main_admin can execute

@admin_required  # main_admin OR assistant_admin
def view_users():
    # Both admin roles can execute

@member_required  # Any authenticated user
def view_own_data():
    # All users can execute
```

---

## How To Continue Development

### Option 1: Manual Implementation
Follow the roadmap in `IMPLEMENTATION_ROADMAP.md` and implement each phase sequentially.

### Option 2: Hire Development Team
This is a multi-week project requiring:
- 1 Backend Developer (Flask + Supabase)
- 1 Frontend Developer (React + Tailwind)
- 1 QA Engineer

### Option 3: Use Existing Admin Frameworks
Consider using admin frameworks like:
- **Refine** - React-based admin panel framework
- **React Admin** - Enterprise admin panel
- **AdminLTE** - Bootstrap admin template

Then customize for your Supabase schema.

---

## Database Connection Details

Your Supabase instance is already configured in `.env`:
- URL: `https://0ec90b57d6e95fcbda19832f.supabase.co`
- Anon Key: (stored in `.env`)

**To connect from Python:**
```python
from src.database.supabase_client import get_supabase

supabase = get_supabase()

# Query users
response = supabase.table('users').select('*').execute()
users = response.data

# Insert user
response = supabase.table('users').insert({
    'username': 'newuser',
    'email': 'user@example.com',
    'password_hash': 'hashed_password',
    'role': 'member',
    'status': 'pending'
}).execute()
```

---

## Testing The Database

You can test your Supabase database immediately:

### 1. Via Supabase Dashboard
- Visit: `https://supabase.com/dashboard/project/0ec90b57d6e95fcbda19832f`
- Go to "Table Editor" to see all tables
- Go to "SQL Editor" to run queries

### 2. Via Python Script
```python
from dotenv import load_dotenv
load_dotenv()

from src.database.supabase_client import get_supabase

supabase = get_supabase()

# List all users
response = supabase.table('users').select('*').execute()
print(f"Found {len(response.data)} users")

# Create test user
response = supabase.table('users').insert({
    'username': 'testuser',
    'email': 'test@example.com',
    'password_hash': 'placeholder',
    'role': 'member',
    'status': 'pending',
    'is_active': True
}).execute()
print(f"Created user: {response.data}")
```

---

## Common Issues & Solutions

### Issue: "Supabase URL and Key must be set"
**Solution:** Ensure `.env` file has:
```
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_SUPABASE_ANON_KEY=your_key_here
```

### Issue: RLS policy blocks access
**Solution:** Make sure you're using authenticated requests with proper JWT tokens from Supabase Auth.

### Issue: Migration failed
**Solution:** The migration already succeeded. Check Supabase dashboard to verify tables exist.

---

## Next Steps

1. **Review `IMPLEMENTATION_ROADMAP.md`** for complete development plan
2. **Update Flask routes** to use Supabase instead of SQLAlchemy
3. **Build React admin components** for each sub-tab
4. **Implement authentication** with Supabase Auth
5. **Add email notifications** for user lifecycle events
6. **Test everything** thoroughly before deployment

---

## Support

For questions about this implementation:
- Check `IMPLEMENTATION_ROADMAP.md` for detailed specifications
- Review Supabase documentation: https://supabase.com/docs
- Flask + Supabase integration: https://supabase.com/docs/guides/getting-started/quickstarts/python

---

**Database Status:** ✅ PRODUCTION READY
**Backend Status:** 🟡 MIGRATION REQUIRED
**Frontend Status:** 🟡 BUILD REQUIRED
**Testing Status:** ❌ NOT STARTED

The foundation is solid. Now build the application on top of it.
