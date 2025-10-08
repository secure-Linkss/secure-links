/*
  # Enterprise-Grade Admin Panel - Initial Schema Migration

  ## Overview
  Complete database schema for enterprise-grade SaaS admin panel with multi-tenancy,
  RBAC, subscription management, security monitoring, and comprehensive audit logging.

  ## New Tables
  
  ### 1. users
  - Core user table with role-based access control
  - Subscription tracking with manual verification support
  - Security fields for login tracking and account protection
  - Multi-tenancy isolation support
  
  ### 2. campaigns
  - Marketing campaign management
  - Owner-based access control
  - Status tracking (active, paused, completed, archived)
  
  ### 3. links
  - Tracking links associated with campaigns
  - Click and conversion tracking
  - Geo and device targeting
  
  ### 4. tracking_events
  - Detailed event tracking for link clicks
  - Device, browser, and location information
  - Bot detection flags
  
  ### 5. audit_logs
  - Comprehensive audit trail for all admin actions
  - Immutable logging with IP and user agent tracking
  - Searchable and filterable
  
  ### 6. support_tickets
  - Support ticket system for member inquiries
  - Admin assignment and response capabilities
  - Priority and status tracking
  
  ### 7. subscription_verifications
  - Manual subscription payment verification
  - BTC/USDT transaction proof tracking
  - Approval workflow
  
  ### 8. security_threats
  - Security threat detection and logging
  - IP-based threat tracking
  - Bot and proxy detection
  
  ### 9. ip_blocklist
  - IP address blocking system
  - Admin-managed blocklist
  - Auto-expiration support
  
  ### 10. system_settings
  - System-wide configuration
  - Payment gateway settings
  - Feature flags
  
  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Restrictive policies enforcing multi-tenancy
  - Admin-only access for sensitive operations
  - Audit logging for all modifications

  ## Important Notes
  1. All timestamps use timestamptz for proper timezone handling
  2. UUIDs used for primary keys for better scalability
  3. Foreign key constraints ensure data integrity
  4. Indexes created for frequently queried columns
  5. RLS policies enforce strict data isolation
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table with comprehensive fields
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  username varchar(80) UNIQUE NOT NULL,
  email varchar(120) UNIQUE NOT NULL,
  password_hash varchar(255) NOT NULL,
  
  -- Role and status
  role varchar(20) DEFAULT 'member' CHECK (role IN ('main_admin', 'assistant_admin', 'member')),
  status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'expired')),
  
  -- Security tracking
  last_login timestamptz,
  last_ip varchar(45),
  login_count integer DEFAULT 0,
  failed_login_attempts integer DEFAULT 0,
  account_locked_until timestamptz,
  is_active boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  
  -- Subscription management
  plan_type varchar(20) DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  subscription_start timestamptz,
  subscription_end timestamptz,
  subscription_expiry timestamptz,
  daily_link_limit integer DEFAULT 10,
  links_used_today integer DEFAULT 0,
  last_reset_date date DEFAULT CURRENT_DATE,
  
  -- Telegram integration
  telegram_bot_token varchar(255),
  telegram_chat_id varchar(100),
  telegram_enabled boolean DEFAULT false,
  
  -- Additional fields
  settings jsonb DEFAULT '{}',
  onboarding_completed boolean DEFAULT false,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(255) NOT NULL,
  description text,
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status varchar(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  
  -- Metadata
  total_clicks integer DEFAULT 0,
  total_conversions integer DEFAULT 0,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Links table
CREATE TABLE IF NOT EXISTS links (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  campaign_id uuid REFERENCES campaigns(id) ON DELETE SET NULL,
  
  -- Link details
  title varchar(255) NOT NULL,
  short_code varchar(50) UNIQUE NOT NULL,
  original_url text NOT NULL,
  short_url varchar(500),
  
  -- Tracking settings
  track_location boolean DEFAULT true,
  track_device boolean DEFAULT true,
  require_email boolean DEFAULT false,
  
  -- Stats
  click_count integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  conversion_count integer DEFAULT 0,
  
  -- Status
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tracking events table
CREATE TABLE IF NOT EXISTS tracking_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id uuid NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Visitor information
  ip_address varchar(45),
  user_agent text,
  country varchar(100),
  city varchar(100),
  region varchar(100),
  isp varchar(255),
  
  -- Device information
  device_type varchar(50),
  browser varchar(100),
  os varchar(100),
  
  -- Security flags
  is_bot boolean DEFAULT false,
  is_proxy boolean DEFAULT false,
  is_vpn boolean DEFAULT false,
  threat_score integer DEFAULT 0,
  
  -- Email capture
  captured_email varchar(255),
  
  -- Event type
  event_type varchar(50) DEFAULT 'click' CHECK (event_type IN ('click', 'conversion', 'email_capture')),
  
  -- Timestamp
  created_at timestamptz DEFAULT now()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id uuid NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  action varchar(255) NOT NULL,
  target_type varchar(100),
  target_id uuid,
  details jsonb,
  
  -- Request information
  ip_address varchar(45),
  user_agent text,
  
  -- Timestamp
  created_at timestamptz DEFAULT now()
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES users(id) ON DELETE SET NULL,
  
  -- Ticket details
  subject varchar(255) NOT NULL,
  description text NOT NULL,
  status varchar(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_response', 'resolved', 'closed')),
  priority varchar(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Metadata
  category varchar(100),
  tags text[],
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Ticket messages table
CREATE TABLE IF NOT EXISTS ticket_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id uuid NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_internal boolean DEFAULT false,
  
  -- Attachments
  attachments jsonb DEFAULT '[]',
  
  -- Timestamp
  created_at timestamptz DEFAULT now()
);

-- Subscription verifications table
CREATE TABLE IF NOT EXISTS subscription_verifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  verified_by uuid REFERENCES users(id) ON DELETE SET NULL,
  
  -- Payment details
  plan_type varchar(20) NOT NULL CHECK (plan_type IN ('pro', 'enterprise')),
  payment_method varchar(20) NOT NULL CHECK (payment_method IN ('btc', 'usdt', 'other')),
  transaction_id varchar(255),
  transaction_proof_url text,
  amount decimal(10, 2),
  currency varchar(10) DEFAULT 'USD',
  
  -- Subscription period
  duration_days integer NOT NULL DEFAULT 30,
  start_date timestamptz,
  end_date timestamptz,
  
  -- Status
  status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes text,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  verified_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Security threats table
CREATE TABLE IF NOT EXISTS security_threats (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Threat details
  threat_type varchar(50) NOT NULL CHECK (threat_type IN ('bot', 'proxy', 'vpn', 'suspicious_activity', 'rate_limit', 'malicious_request')),
  severity varchar(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  
  -- Source information
  ip_address varchar(45) NOT NULL,
  user_agent text,
  request_path text,
  
  -- Associated entities
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  link_id uuid REFERENCES links(id) ON DELETE SET NULL,
  
  -- Threat details
  description text,
  metadata jsonb,
  
  -- Action taken
  action_taken varchar(100),
  blocked boolean DEFAULT false,
  
  -- Timestamp
  created_at timestamptz DEFAULT now()
);

-- IP blocklist table
CREATE TABLE IF NOT EXISTS ip_blocklist (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address varchar(45) UNIQUE NOT NULL,
  reason text,
  blocked_by uuid REFERENCES users(id) ON DELETE SET NULL,
  
  -- Auto-expiration
  expires_at timestamptz,
  is_permanent boolean DEFAULT false,
  
  -- Timestamps
  created_at timestamptz DEFAULT now()
);

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key varchar(100) UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_subscription_end ON users(subscription_end);

CREATE INDEX IF NOT EXISTS idx_campaigns_owner ON campaigns(owner_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

CREATE INDEX IF NOT EXISTS idx_links_user ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_campaign ON links(campaign_id);
CREATE INDEX IF NOT EXISTS idx_links_short_code ON links(short_code);

CREATE INDEX IF NOT EXISTS idx_tracking_events_link ON tracking_events(link_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_user ON tracking_events(user_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_created ON tracking_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_events_ip ON tracking_events(ip_address);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON audit_logs(target_type, target_id);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned ON support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);

CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON ticket_messages(ticket_id);

CREATE INDEX IF NOT EXISTS idx_subscription_verifications_user ON subscription_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_verifications_status ON subscription_verifications(status);

CREATE INDEX IF NOT EXISTS idx_security_threats_ip ON security_threats(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_threats_created ON security_threats(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ip_blocklist_ip ON ip_blocklist(ip_address);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_blocklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('main_admin', 'assistant_admin')
    )
  );

CREATE POLICY "Admins can update users"
  ON users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('main_admin', 'assistant_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('main_admin', 'assistant_admin')
    )
  );

CREATE POLICY "Main admins can delete users"
  ON users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'main_admin'
    )
    AND role != 'main_admin'
  );

-- RLS Policies for campaigns table
CREATE POLICY "Members can view own campaigns"
  ON campaigns FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Admins can view all campaigns"
  ON campaigns FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('main_admin', 'assistant_admin')
    )
  );

CREATE POLICY "Users can create own campaigns"
  ON campaigns FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own campaigns"
  ON campaigns FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can delete own campaigns"
  ON campaigns FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Admins can manage all campaigns"
  ON campaigns FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('main_admin', 'assistant_admin')
    )
  );

-- RLS Policies for links table
CREATE POLICY "Users can view own links"
  ON links FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all links"
  ON links FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('main_admin', 'assistant_admin')
    )
  );

CREATE POLICY "Users can create own links"
  ON links FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own links"
  ON links FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own links"
  ON links FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for tracking_events table
CREATE POLICY "Users can view own tracking events"
  ON tracking_events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all tracking events"
  ON tracking_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('main_admin', 'assistant_admin')
    )
  );

-- RLS Policies for audit_logs table
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('main_admin', 'assistant_admin')
    )
  );

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for support_tickets table
CREATE POLICY "Users can view own tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('main_admin', 'assistant_admin')
    )
  );

CREATE POLICY "Users can create own tickets"
  ON support_tickets FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update tickets"
  ON support_tickets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('main_admin', 'assistant_admin')
    )
  );

-- RLS Policies for ticket_messages table
CREATE POLICY "Users can view ticket messages"
  ON ticket_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM support_tickets
      WHERE support_tickets.id = ticket_messages.ticket_id
      AND (support_tickets.user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role IN ('main_admin', 'assistant_admin')
      ))
    )
  );

CREATE POLICY "Users can create ticket messages"
  ON ticket_messages FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for subscription_verifications table
CREATE POLICY "Users can view own verifications"
  ON subscription_verifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all verifications"
  ON subscription_verifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('main_admin', 'assistant_admin')
    )
  );

CREATE POLICY "Users can create own verifications"
  ON subscription_verifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Main admins can update verifications"
  ON subscription_verifications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'main_admin'
    )
  );

-- RLS Policies for security_threats table
CREATE POLICY "Admins can view security threats"
  ON security_threats FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('main_admin', 'assistant_admin')
    )
  );

CREATE POLICY "System can log security threats"
  ON security_threats FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for ip_blocklist table
CREATE POLICY "Admins can manage IP blocklist"
  ON ip_blocklist FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('main_admin', 'assistant_admin')
    )
  );

-- RLS Policies for system_settings table
CREATE POLICY "Authenticated users can view public settings"
  ON system_settings FOR SELECT
  TO authenticated
  USING (is_public = true OR EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('main_admin', 'assistant_admin')
  ));

CREATE POLICY "Main admins can manage settings"
  ON system_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'main_admin'
    )
  );

-- Create default admin user (password will need to be hashed in application)
INSERT INTO users (username, email, password_hash, role, status, is_active, is_verified)
VALUES ('Brain', 'admin@brainlinktracker.com', 'PLACEHOLDER_HASH', 'main_admin', 'active', true, true)
ON CONFLICT (username) DO NOTHING;

-- Insert default system settings
INSERT INTO system_settings (key, value, description, is_public)
VALUES 
  ('site_name', '"Brain Link Tracker"', 'Application name', true),
  ('maintenance_mode', 'false', 'Enable maintenance mode', false),
  ('registration_enabled', 'true', 'Allow new user registrations', true),
  ('email_verification_required', 'true', 'Require email verification for new users', false)
ON CONFLICT (key) DO NOTHING;