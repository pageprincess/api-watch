/**
 * Monitored APIs Endpoints
 *
 * GET: List all monitored APIs
 * POST: Add a new API to monitor
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getActiveAPIs, createMonitoredAPI, type Env } from '$lib/services/database';
import { fetchOpenAPISpec } from '$lib/services/spec-fetcher';

export const GET: RequestHandler = async ({ platform, locals }) => {
  const env = (locals as unknown as { env: Env }).env || platform?.env;

  if (!env) {
    return json({ error: 'Environment not available' }, { status: 500 });
  }

  const apis = await getActiveAPIs(env);
  return json({ apis });
};

export const POST: RequestHandler = async ({ platform, locals, request }) => {
  const env = (locals as unknown as { env: Env }).env || platform?.env;

  if (!env) {
    return json({ error: 'Environment not available' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { name, spec_url, check_interval = 60, alert_email, alert_webhook, active = true } =
      body;

    // Validate required fields
    if (!name || !spec_url) {
      return json({ error: 'Missing required fields: name, spec_url' }, { status: 400 });
    }

    // Validate spec URL is accessible
    const specResult = await fetchOpenAPISpec(spec_url);
    if (!specResult.success) {
      return json(
        { error: 'Invalid spec URL', details: specResult.error },
        { status: 400 }
      );
    }

    // Create monitored API
    const apiId = await createMonitoredAPI(env, {
      name,
      spec_url,
      check_interval,
      alert_email,
      alert_webhook,
      active,
    });

    return json(
      {
        success: true,
        api_id: apiId,
        message: 'API added to monitoring',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create monitored API:', error);
    return json(
      {
        error: 'Failed to create monitored API',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};
