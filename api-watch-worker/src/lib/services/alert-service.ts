/**
 * Alert Service
 *
 * Sends notifications via email (Resend) and webhooks
 */

export interface AlertConfig {
  type: 'email' | 'slack' | 'webhook';
  destination: string;
}

export interface BreakingChangeAlert {
  apiName: string;
  apiVersion: string;
  specUrl: string;
  changes: {
    type: string;
    severity: string;
    description: string;
    location: string;
  }[];
  detectedAt: Date;
  previousSpecHash: string;
  newSpecHash: string;
}

/**
 * Send breaking change alert via email
 */
export async function sendEmailAlert(
  to: string,
  alert: BreakingChangeAlert
): Promise<{ success: boolean; error?: string }> {
  // For MVP, we'll use Resend API
  // In production, this would be called from a Cloudflare Worker

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    return {
      success: false,
      error: 'Resend API key not configured',
    };
  }

  const emailContent = formatEmailAlert(alert);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'APIWatch <alerts@api-watch.dev>',
        to: [to],
        subject: `🚨 Breaking Changes Detected in ${alert.apiName}`,
        html: emailContent.html,
        text: emailContent.text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        success: false,
        error: `Resend API error: ${error}`,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send breaking change alert via Slack webhook
 */
export async function sendSlackAlert(
  webhookUrl: string,
  alert: BreakingChangeAlert
): Promise<{ success: boolean; error?: string }> {
  const slackMessage = formatSlackAlert(alert);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackMessage),
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        success: false,
        error: `Slack webhook error: ${error}`,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Format alert as email
 */
function formatEmailAlert(alert: BreakingChangeAlert): {
  html: string;
  text: string;
} {
  const criticalCount = alert.changes.filter((c) => c.severity === 'critical').length;
  const majorCount = alert.changes.filter((c) => c.severity === 'major').length;
  const minorCount = alert.changes.filter((c) => c.severity === 'minor').length;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .change-item { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #e5e7eb; border-radius: 4px; }
    .critical { border-left-color: #ef4444; }
    .major { border-left-color: #f59e0b; }
    .minor { border-left-color: #10b981; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
    .badge-critical { background: #fee2e2; color: #991b1b; }
    .badge-major { background: #fef3c7; color: #92400e; }
    .badge-minor { background: #d1fae5; color: #065f46; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
    .btn { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚨 Breaking Changes Detected</h1>
      <p style="margin: 0; opacity: 0.9;">${alert.apiName} has breaking API changes</p>
    </div>
    <div class="content">
      <h2>Summary</h2>
      <p>
        <strong>${criticalCount}</strong> critical,
        <strong>${majorCount}</strong> major,
        <strong>${minorCount}</strong> minor changes detected
      </p>

      <h3>API Details</h3>
      <ul>
        <li><strong>Name:</strong> ${alert.apiName}</li>
        <li><strong>Version:</strong> ${alert.apiVersion}</li>
        <li><strong>Spec URL:</strong> <a href="${alert.specUrl}">${alert.specUrl}</a></li>
        <li><strong>Detected:</strong> ${alert.detectedAt.toLocaleString()}</li>
      </ul>

      <h3>Breaking Changes</h3>
      ${alert.changes
        .map(
          (change) => `
        <div class="change-item ${change.severity}">
          <span class="badge badge-${change.severity}">${change.severity}</span>
          <span class="badge" style="background: #e5e7eb; color: #374151; margin-left: 8px;">${
            change.type
          }</span>
          <p style="margin: 10px 0 0 0;"><strong>${change.description}</strong></p>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">📍 ${change.location}</p>
        </div>
      `
        )
        .join('')}

      <div style="text-align: center;">
        <a href="https://api-watch.dev/dashboard" class="btn">View in Dashboard</a>
      </div>

      <div class="footer">
        <p>You're receiving this because you're monitoring <strong>${alert.apiName}</strong> on APIWatch.</p>
        <p><a href="https://api-watch.dev/unsubscribe?api=${encodeURIComponent(
          alert.specUrl
        )}">Unsubscribe</a> from these alerts.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
🚨 BREAKING CHANGES DETECTED

API: ${alert.apiName}
Version: ${alert.apiVersion}

SUMMARY
${criticalCount} critical, ${majorCount} major, ${minorCount} minor changes

CHANGES
${alert.changes.map((c) => `
[${c.severity.toUpperCase()}] ${c.type}
${c.description}
Location: ${c.location}
`).join('\n')}

---
View in Dashboard: https://api-watch.dev
Unsubscribe: https://api-watch.dev/unsubscribe?api=${encodeURIComponent(alert.specUrl)}
  `;

  return { html, text };
}

/**
 * Format alert as Slack message
 */
function formatSlackAlert(alert: BreakingChangeAlert): unknown {
  const criticalCount = alert.changes.filter((c) => c.severity === 'critical').length;
  const majorCount = alert.changes.filter((c) => c.severity === 'major').length;

  return {
    text: `🚨 Breaking Changes Detected in ${alert.apiName}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `🚨 Breaking Changes Detected`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*API:*\n${alert.apiName}`,
          },
          {
            type: 'mrkdwn',
            text: `*Version:*\n${alert.apiVersion}`,
          },
          {
            type: 'mrkdwn',
            text: `*Critical:*\n${criticalCount}`,
          },
          {
            type: 'mrkdwn',
            text: `*Major:*\n${majorCount}`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Changes*\n${alert.changes
            .slice(0, 5)
            .map((c) => `• ${c.severity}: ${c.description}`)
            .join('\n')}${alert.changes.length > 5 ? `\n_...and ${alert.changes.length - 5} more_` : ''}`,
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Details',
            },
            url: 'https://api-watch.dev/dashboard',
            action_id: 'view_details',
          },
        ],
      },
    ],
  };
}
