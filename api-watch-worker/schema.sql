-- APIWatch Database Schema
-- D1 (SQLite) - Production Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    plan TEXT DEFAULT 'free', -- free, starter, pro, enterprise
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    stripe_customer_id TEXT
);

-- Monitored APIs
CREATE TABLE IF NOT EXISTS monitors (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    openapi_url TEXT NOT NULL,
    check_frequency TEXT DEFAULT 'daily', -- daily, hourly, 15min
    is_active INTEGER DEFAULT 1,
    last_check_at INTEGER,
    next_check_at INTEGER,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Check results (each time we check an API)
CREATE TABLE IF NOT EXISTS check_results (
    id TEXT PRIMARY KEY,
    monitor_id TEXT NOT NULL,
    checked_at INTEGER DEFAULT (strftime('%s', 'now')),
    spec_version TEXT, -- hash of the spec content
    has_breaking_changes INTEGER DEFAULT 0,
    breaking_change_count INTEGER DEFAULT 0,
    non_breaking_change_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'success', -- success, failed
    error_message TEXT,
    FOREIGN KEY (monitor_id) REFERENCES monitors(id)
);

-- Individual changes detected
CREATE TABLE IF NOT EXISTS changes (
    id TEXT PRIMARY KEY,
    check_result_id TEXT NOT NULL,
    type TEXT NOT NULL, -- breaking, non_breaking
    category TEXT NOT NULL, -- endpoint_deleted, parameter_removed, etc.
    description TEXT NOT NULL,
    path TEXT, -- e.g., /v1/charges/:id
    diff_json TEXT, -- JSON with detailed diff
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (check_result_id) REFERENCES check_results(id)
);

-- Alert channels
CREATE TABLE IF NOT EXISTS alert_channels (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL, -- email, slack, webhook
    config TEXT NOT NULL, -- JSON config
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Alerts sent
CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    check_result_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, sent, failed
    sent_at INTEGER,
    error_message TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (check_result_id) REFERENCES check_results(id),
    FOREIGN KEY (channel_id) REFERENCES alert_channels(id)
);

-- Sessions for authentication
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    magic_link_token TEXT UNIQUE,
    expires_at INTEGER NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_monitors_user_id ON monitors(user_id);
CREATE INDEX IF NOT EXISTS idx_monitors_next_check ON monitors(next_check_at, is_active);
CREATE INDEX IF NOT EXISTS idx_check_results_monitor_id ON check_results(monitor_id, checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_changes_check_result_id ON changes(check_result_id);
CREATE INDEX IF NOT EXISTS idx_alerts_check_result_id ON alerts(check_result_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(magic_link_token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Template APIs (pre-configured popular APIs)
CREATE TABLE IF NOT EXISTS template_apis (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    openapi_url TEXT NOT NULL,
    category TEXT, -- payment, communication, ai, etc.
    icon_url TEXT,
    is_active INTEGER DEFAULT 1
);

-- Insert some template APIs
INSERT OR IGNORE INTO template_apis (id, name, description, openapi_url, category, icon_url) VALUES
    ('stripe', 'Stripe', 'Payment processing API', 'https://stripe.com/openapi.yaml', 'payment', 'https://stripe.com/img/favicon.png'),
    ('github', 'GitHub', 'Git platform API', 'https://api.github.com/openapi.yaml', 'devops', 'https://github.com/favicon.ico'),
    ('slack', 'Slack', 'Team communication API', 'https://api.slack.com/openapi.yaml', 'communication', 'https://slack.com/favicon.ico'),
    ('openai', 'OpenAI', 'AI/ML API', 'https://openai.com/openapi.yaml', 'ai', 'https://openai.com/favicon.ico'),
    ('twilio', 'Twilio', 'Communication services API', 'https://twilio.com/openapi.yaml', 'communication', 'https://twilio.com/favicon.ico');
