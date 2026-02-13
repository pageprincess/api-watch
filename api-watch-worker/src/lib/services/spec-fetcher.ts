/**
 * API Spec Fetcher Service
 *
 * Fetches and parses OpenAPI/Swagger specifications from URLs
 * Supports OpenAPI 3.x and Swagger 2.x
 */

// Simple OpenAPI validation without external dependency
// For MVP, we just check basic structure
function isValidOpenAPI(content: unknown): boolean {
  if (!content || typeof content !== 'object') return false;
  const doc = content as Record<string, unknown>;
  return !!(doc.openapi || doc.swagger) && !!doc.paths;
}

export interface APISpec {
  url: string;
  version: string;
  title: string;
  content: unknown;
  fetchedAt: Date;
  hash: string;
}

export interface FetchResult {
  success: boolean;
  spec?: APISpec;
  error?: string;
}

/**
 * Fetch OpenAPI spec from URL
 */
export async function fetchOpenAPISpec(url: string): Promise<FetchResult> {
  try {
    // Fetch the spec
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'APIWatch/1.0 (https://api-watch.dev)',
      },
      signal: AbortSignal.timeout(30000), // 30s timeout
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    // Parse JSON
    const content = await response.json();

    // Validate as OpenAPI
    if (!isValidOpenAPI(content)) {
      return {
        success: false,
        error: 'Invalid OpenAPI spec: missing openapi/swagger field or paths',
      };
    }

    // Extract metadata
    const spec = content as {
      info?: { title?: string; version?: string };
      openapi?: string;
      swagger?: string;
    };

    const title = spec.info?.title || 'Untitled API';
    const version = spec.info?.version || '1.0.0';
    const hash = await generateHash(content);

    return {
      success: true,
      spec: {
        url,
        version,
        title,
        content,
        fetchedAt: new Date(),
        hash,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch spec',
    };
  }
}

/**
 * Generate content hash for comparison
 */
async function generateHash(content: unknown): Promise<string> {
  const str = JSON.stringify(content);
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if two specs are the same
 */
export function specsEqual(a: APISpec, b: APISpec): boolean {
  return a.hash === b.hash;
}
