/**
 * API Check Endpoint
 *
 * Cron job endpoint that checks all active monitored APIs for changes
 * Called by Cloudflare Workers Cron Trigger
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fetchOpenAPISpec, type APISpec } from '$lib/services/spec-fetcher';
import { detectBreakingChanges, formatBreakingChanges } from '$lib/services/breaking-detector';
import { sendEmailAlert, sendSlackAlert } from '$lib/services/alert-service';
import {
  getActiveAPIs,
  getLatestSpec,
  saveSpecSnapshot,
  saveChangeRecord,
  updateLastChecked,
  type Env
} from '$lib/services/database';

export const GET: RequestHandler = async ({ platform, locals }) => {
  const env = (locals as unknown as { env: Env }).env || platform?.env;

  if (!env) {
    return json({ error: 'Environment not available' }, { status: 500 });
  }

  try {
    const results = await checkAllAPIs(env);
    return json(results);
  } catch (error) {
    console.error('Check failed:', error);
    return json(
      {
        error: 'Check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};

interface CheckResult {
  apiId: number;
  apiName: string;
  success: boolean;
  hasChanges: boolean;
  hasBreakingChanges: boolean;
  breakingChangesCount: number;
  error?: string;
}

interface CheckResults {
  checked: number;
  succeeded: number;
  failed: number;
  changesDetected: number;
  breakingChangesDetected: number;
  results: CheckResult[];
}

async function checkAllAPIs(env: Env): Promise<CheckResults> {
  const apis = await getActiveAPIs(env);

  const results: CheckResult[] = [];
  let succeeded = 0;
  let failed = 0;
  let changesDetected = 0;
  let breakingChangesDetected = 0;

  for (const api of apis) {
    try {
      const result = await checkSingleAPI(env, api);
      results.push(result);

      if (result.success) {
        succeeded++;
        if (result.hasChanges) changesDetected++;
        if (result.hasBreakingChanges) breakingChangesDetected++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`Failed to check API ${api.id}:`, error);
      results.push({
        apiId: api.id,
        apiName: api.name,
        success: false,
        hasChanges: false,
        hasBreakingChanges: false,
        breakingChangesCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      failed++;
    }
  }

  return {
    checked: apis.length,
    succeeded,
    failed,
    changesDetected,
    breakingChangesDetected,
    results,
  };
}

async function checkSingleAPI(
  env: Env,
  api: {
    id: number;
    name: string;
    spec_url: string;
    alert_email?: string;
    alert_webhook?: string;
  }
): Promise<CheckResult> {
  const baseResult = {
    apiId: api.id,
    apiName: api.name,
    success: false as boolean,
    hasChanges: false,
    hasBreakingChanges: false,
    breakingChangesCount: 0,
  };

  // 1. Fetch current spec
  const fetchResult = await fetchOpenAPISpec(api.spec_url);
  if (!fetchResult.success || !fetchResult.spec) {
    return {
      ...baseResult,
      error: fetchResult.error || 'Failed to fetch spec',
    };
  }

  const newSpec = fetchResult.spec;

  // 2. Get previous spec from database
  const oldSpecSnapshot = await getLatestSpec(env, api.id);
  const oldSpec: APISpec | null = oldSpecSnapshot
    ? {
        url: api.spec_url,
        version: oldSpecSnapshot.version,
        title: oldSpecSnapshot.title,
        content: JSON.parse(oldSpecSnapshot.spec_content),
        fetchedAt: new Date(oldSpecSnapshot.fetched_at),
        hash: oldSpecSnapshot.spec_hash,
      }
    : null;

  // 3. Check for changes
  const hasChanges = !oldSpec || oldSpec.hash !== newSpec.hash;

  if (!hasChanges) {
    // No changes, just update last checked
    await updateLastChecked(env, api.id);
    return {
      ...baseResult,
      success: true,
    };
  }

  // 4. Detect breaking changes
  let hasBreakingChanges = false;
  let breakingChangesCount = 0;
  let breakingChanges: unknown[] = [];

  if (oldSpec) {
    const diffResult = detectBreakingChanges(oldSpec, newSpec);
    hasBreakingChanges = diffResult.hasBreakingChanges;
    breakingChangesCount = diffResult.changes.length;
    breakingChanges = diffResult.changes;

    // 5. Save change record if breaking changes detected
    if (hasBreakingChanges) {
      await saveChangeRecord(env, {
        api_id: api.id,
        old_spec_hash: oldSpec.hash,
        new_spec_hash: newSpec.hash,
        changes: JSON.stringify(diffResult.changes),
      });

      // 6. Send alerts
      await sendAlerts(api, newSpec, diffResult.changes);
    }
  }

  // 7. Save new spec snapshot
  await saveSpecSnapshot(env, {
    api_id: api.id,
    spec_hash: newSpec.hash,
    spec_content: JSON.stringify(newSpec.content),
    version: newSpec.version,
    title: newSpec.title,
  });

  // 8. Update last checked
  await updateLastChecked(env, api.id);

  return {
    ...baseResult,
    success: true,
    hasChanges: true,
    hasBreakingChanges,
    breakingChangesCount,
  };
}

async function sendAlerts(
  api: { alert_email?: string; alert_webhook?: string; id: number; name: string; spec_url: string },
  newSpec: APISpec,
  changes: unknown[]
): Promise<void> {
  const alert = {
    apiName: api.name,
    apiVersion: newSpec.version,
    specUrl: api.spec_url,
    changes: changes as { type: string; severity: string; description: string; location: string }[],
    detectedAt: new Date(),
    previousSpecHash: 'previous', // Would be filled from DB
    newSpecHash: newSpec.hash,
  };

  // Send email alert
  if (api.alert_email) {
    try {
      await sendEmailAlert(api.alert_email, alert);
    } catch (error) {
      console.error('Failed to send email alert:', error);
    }
  }

  // Send webhook alert
  if (api.alert_webhook) {
    try {
      if (api.alert_webhook.includes('hooks.slack.com')) {
        await sendSlackAlert(api.alert_webhook, alert);
      }
    } catch (error) {
      console.error('Failed to send webhook alert:', error);
    }
  }
}
