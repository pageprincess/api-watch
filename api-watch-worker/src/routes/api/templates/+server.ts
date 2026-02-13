/**
 * API Templates Endpoint
 *
 * GET: List available API monitoring templates
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const API_TEMPLATES = [
  {
    id: 'stripe',
    name: 'Stripe API',
    spec_url: 'https://stripe.com/docs/openapi/openapi.spec.yaml',
    description: 'Payment processing API',
    check_interval: 60,
    icon: '💳',
    category: 'Payments',
  },
  {
    id: 'github',
    name: 'GitHub REST API',
    spec_url: 'https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.json',
    description: 'Version control and collaboration API',
    check_interval: 60,
    icon: '🐙',
    category: 'Development',
  },
  {
    id: 'slack',
    name: 'Slack API',
    spec_url: 'https://raw.githubusercontent.com/slackapi/slack-api-spec/main/web-api/openapi.json',
    description: 'Team communication API',
    check_interval: 60,
    icon: '💼',
    category: 'Communication',
  },
  {
    id: 'openai',
    name: 'OpenAI API',
    spec_url: 'https://raw.githubusercontent.com/openai/openai-openapi/master/openapi.yaml',
    description: 'AI and language model API',
    check_interval: 60,
    icon: '🤖',
    category: 'AI/ML',
  },
  {
    id: 'twilio',
    name: 'Twilio API',
    spec_url: 'https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/json/twilio_api_v2010.json',
    description: 'Communication and SMS API',
    check_interval: 60,
    icon: '📞',
    category: 'Communication',
  },
  {
    id: 'sendgrid',
    name: 'SendGrid API',
    spec_url: 'https://raw.githubusercontent.com/sendgrid/sendgrid-oai/main/openapi.json',
    description: 'Email delivery API',
    check_interval: 60,
    icon: '📧',
    category: 'Email',
  },
  {
    id: 'shopify',
    name: 'Shopify Admin API',
    spec_url: 'https://raw.githubusercontent.com/Shopify/shopify-api-spec/main/admin.openapi.json',
    description: 'E-commerce platform API',
    check_interval: 60,
    icon: '🛍️',
    category: 'E-commerce',
  },
  {
    id: 'discord',
    name: 'Discord API',
    spec_url: 'https://raw.githubusercontent.com/discord/discord-api-spec/main/spec.json',
    description: 'Gaming community API',
    check_interval: 60,
    icon: '🎮',
    category: 'Communication',
  },
  {
    id: 'notion',
    name: 'Notion API',
    spec_url: 'https://raw.githubusercontent.com/schema-ninja/specs/main/notion/api.notion.com/swagger.json',
    description: 'Productivity and docs API',
    check_interval: 60,
    icon: '📝',
    category: 'Productivity',
  },
  {
    id: 'linear',
    name: 'Linear API',
    spec_url: 'https://raw.githubusercontent.com/schema-ninja/specs/main/linear/public.linear.io/swagger.json',
    description: 'Project management API',
    check_interval: 60,
    icon: '📊',
    category: 'Productivity',
  },
];

export const GET: RequestHandler = () => {
  return json({ templates: API_TEMPLATES });
};
