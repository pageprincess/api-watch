/**
 * API Templates Seed Data
 *
 * Pre-configured API monitoring templates for popular services
 */

export const API_TEMPLATES = [
  {
    name: 'Stripe API',
    spec_url: 'https://stripe.com/docs/openapi/openapi.spec.yaml',
    description: 'Payment processing API',
    check_interval: 60,
    icon: '💳',
  },
  {
    name: 'GitHub REST API',
    spec_url: 'https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.json',
    description: 'Version control and collaboration API',
    check_interval: 60,
    icon: '🐙',
  },
  {
    name: 'Slack API',
    spec_url: 'https://raw.githubusercontent.com/slackapi/slack-api-specs/main/web-api/openapi.json',
    description: 'Team communication API',
    check_interval: 60,
    icon: '💼',
  },
  {
    name: 'OpenAI API',
    spec_url: 'https://raw.githubusercontent.com/openai/openai-openapi/master/openapi.yaml',
    description: 'AI and language model API',
    check_interval: 60,
    icon: '🤖',
  },
  {
    name: 'Twilio API',
    spec_url: 'https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/json/twilio_api_v2010.json',
    description: 'Communication and SMS API',
    check_interval: 60,
    icon: '📞',
  },
  {
    name: 'SendGrid API',
    spec_url: 'https://raw.githubusercontent.com/sendgrid/sendgrid-oai/main/openapi.json',
    description: 'Email delivery API',
    check_interval: 60,
    icon: '📧',
  },
  {
    name: 'Shopify Admin API',
    spec_url: 'https://raw.githubusercontent.com/Shopify/shopify-api-spec/main/admin.openapi.json',
    description: 'E-commerce platform API',
    check_interval: 60,
    icon: '🛍️',
  },
  {
    name: 'Discord API',
    spec_url: 'https://raw.githubusercontent.com/discord/discord-api-spec/main/spec.json',
    description: 'Gaming community API',
    check_interval: 60,
    icon: '🎮',
  },
];

/**
 * Initialize templates in database
 */
export async function seedTemplates(env: { DB: D1Database }): Promise<void> {
  for (const template of API_TEMPLATES) {
    try {
      await env.DB.prepare(
        'INSERT OR IGNORE INTO api_templates (name, spec_url, description, check_interval, icon) VALUES (?, ?, ?, ?, ?)'
      )
        .bind(template.name, template.spec_url, template.description, template.check_interval, template.icon)
        .run();
    } catch (error) {
      console.error(`Failed to seed template ${template.name}:`, error);
    }
  }
}

/**
 * Get all templates
 */
export async function getTemplates(env: { DB: D1Database }) {
  const result = await env.DB.prepare('SELECT * FROM api_templates ORDER BY name').all();
  return result.results;
}
