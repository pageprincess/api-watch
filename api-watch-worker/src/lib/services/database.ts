/**
 * Database Service
 *
 * Manages D1 database operations for API specs and change history
 */

export interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
}

export interface MonitoredAPI {
  id: number;
  name: string;
  spec_url: string;
  check_interval: number; // minutes
  alert_email?: string;
  alert_webhook?: string;
  created_at: string;
  last_checked_at?: string;
  active: boolean;
}

export interface SpecSnapshot {
  id: number;
  api_id: number;
  spec_hash: string;
  spec_content: string; // JSON string
  fetched_at: string;
  version: string;
  title: string;
}

export interface ChangeRecord {
  id: number;
  api_id: number;
  old_spec_hash: string;
  new_spec_hash: string;
  changes: string; // JSON array of breaking changes
  detected_at: string;
  alerted: boolean;
}

/**
 * Get active monitored APIs
 */
export async function getActiveAPIs(env: Env): Promise<MonitoredAPI[]> {
  const result = await env.DB.prepare(
    'SELECT * FROM monitored_apis WHERE active = 1 ORDER BY created_at DESC'
  ).all<MonitoredAPI>();

  return result.results || [];
}

/**
 * Get API by ID
 */
export async function getAPIById(
  env: Env,
  id: number
): Promise<MonitoredAPI | null> {
  const result = await env.DB.prepare(
    'SELECT * FROM monitored_apis WHERE id = ?'
  )
    .bind(id)
    .first<MonitoredAPI>();

  return result || null;
}

/**
 * Create monitored API
 */
export async function createMonitoredAPI(
  env: Env,
  data: Omit<MonitoredAPI, 'id' | 'created_at' | 'last_checked_at'>
): Promise<number> {
  const result = await env.DB.prepare(
    'INSERT INTO monitored_apis (name, spec_url, check_interval, alert_email, alert_webhook, active) VALUES (?, ?, ?, ?, ?, ?) RETURNING id'
  )
    .bind(
      data.name,
      data.spec_url,
      data.check_interval,
      data.alert_email || null,
      data.alert_webhook || null,
      data.active ? 1 : 0
    )
    .first<{ id: number }>();

  return result?.id || 0;
}

/**
 * Update API last checked timestamp
 */
export async function updateLastChecked(env: Env, apiId: number): Promise<void> {
  await env.DB.prepare(
    'UPDATE monitored_apis SET last_checked_at = datetime("now") WHERE id = ?'
  )
    .bind(apiId)
    .run();
}

/**
 * Get latest spec snapshot for an API
 */
export async function getLatestSpec(
  env: Env,
  apiId: number
): Promise<SpecSnapshot | null> {
  const result = await env.DB.prepare(
    'SELECT * FROM spec_snapshots WHERE api_id = ? ORDER BY fetched_at DESC LIMIT 1'
  )
    .bind(apiId)
    .first<SpecSnapshot>();

  return result || null;
}

/**
 * Save spec snapshot
 */
export async function saveSpecSnapshot(
  env: Env,
  data: Omit<SpecSnapshot, 'id' | 'fetched_at'>
): Promise<number> {
  const result = await env.DB.prepare(
    'INSERT INTO spec_snapshots (api_id, spec_hash, spec_content, version, title, fetched_at) VALUES (?, ?, ?, ?, ?, datetime("now")) RETURNING id'
  )
    .bind(
      data.api_id,
      data.spec_hash,
      data.spec_content,
      data.version,
      data.title
    )
    .first<{ id: number }>();

  return result?.id || 0;
}

/**
 * Save breaking change record
 */
export async function saveChangeRecord(
  env: Env,
  data: Omit<ChangeRecord, 'id' | 'detected_at' | 'alerted'>
): Promise<number> {
  const result = await env.DB.prepare(
    'INSERT INTO change_records (api_id, old_spec_hash, new_spec_hash, changes, detected_at, alerted) VALUES (?, ?, ?, ?, datetime("now"), 0) RETURNING id'
  )
    .bind(
      data.api_id,
      data.old_spec_hash,
      data.new_spec_hash,
      data.changes
    )
    .first<{ id: number }>();

  return result?.id || 0;
}

/**
 * Get change history for an API
 */
export async function getChangeHistory(
  env: Env,
  apiId: number,
  limit = 10
): Promise<ChangeRecord[]> {
  const result = await env.DB.prepare(
    'SELECT * FROM change_records WHERE api_id = ? ORDER BY detected_at DESC LIMIT ?'
  )
    .bind(apiId, limit)
    .all<ChangeRecord>();

  return result.results || [];
}

/**
 * Check KV cache for spec hash
 */
export async function getCachedSpecHash(
  env: Env,
  specUrl: string
): Promise<string | null> {
  const cacheKey = `spec:hash:${specUrl}`;
  const cached = await env.CACHE.get(cacheKey);
  return cached;
}

/**
 * Cache spec hash
 */
export async function setCachedSpecHash(
  env: Env,
  specUrl: string,
  hash: string,
  ttl = 3600
): Promise<void> {
  const cacheKey = `spec:hash:${specUrl}`;
  await env.CACHE.put(cacheKey, hash, { expirationTtl: ttl });
}

/**
 * Get API stats
 */
export async function getAPIStats(env: Env, apiId: number) {
  const stats = await env.DB.prepare(`
    SELECT
      (SELECT COUNT(*) FROM spec_snapshots WHERE api_id = ?) as total_snapshots,
      (SELECT COUNT(*) FROM change_records WHERE api_id = ?) as total_changes,
      (SELECT MAX(fetched_at) FROM spec_snapshots WHERE api_id = ?) as last_check
  `)
    .bind(apiId, apiId, apiId)
    .first<{
      total_snapshots: number;
      total_changes: number;
      last_check: string;
    }>();

  return stats;
}
