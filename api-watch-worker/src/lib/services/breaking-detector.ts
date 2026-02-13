/**
 * Breaking Change Detector Service
 *
 * Analyzes OpenAPI spec changes to identify breaking changes
 * Based on oasdiff logic simplified for MVP
 */

import type { APISpec } from './spec-fetcher.js';

export interface BreakingChange {
  type: 'endpoint' | 'parameter' | 'response' | 'schema';
  severity: 'critical' | 'major' | 'minor';
  description: string;
  location: string;
}

export interface DiffResult {
  hasBreakingChanges: boolean;
  changes: BreakingChange[];
  summary: string;
}

/**
 * Compare two OpenAPI specs and detect breaking changes
 */
export function detectBreakingChanges(
  oldSpec: APISpec,
  newSpec: APISpec
): DiffResult {
  const changes: BreakingChange[] = [];

  const oldDoc = oldSpec.content as OpenAPIDocument;
  const newDoc = newSpec.content as OpenAPIDocument;

  // Check for deleted endpoints
  const deletedEndpoints = findDeletedEndpoints(oldDoc, newDoc);
  changes.push(...deletedEndpoints);

  // Check for changed HTTP methods
  const changedMethods = findChangedMethods(oldDoc, newDoc);
  changes.push(...changedMethods);

  // Check for required parameter removal
  const removedRequiredParams = findRemovedRequiredParameters(oldDoc, newDoc);
  changes.push(...removedRequiredParams);

  // Check for response type changes
  const responseChanges = findResponseTypeChanges(oldDoc, newDoc);
  changes.push(...responseChanges);

  // Check for required property removal in schemas
  const schemaChanges = findSchemaBreakingChanges(oldDoc, newDoc);
  changes.push(...schemaChanges);

  const hasBreakingChanges = changes.length > 0;

  return {
    hasBreakingChanges,
    changes,
    summary: hasBreakingChanges
      ? `Found ${changes.length} breaking change(s)`
      : 'No breaking changes detected',
  };
}

type OpenAPIDocument = {
  openapi?: string;
  swagger?: string;
  paths?: Record<string, PathItem>;
  components?: {
    schemas?: Record<string, Schema>;
  };
  definitions?: Record<string, Schema>;
};

type PathItem = {
  get?: Operation;
  post?: Operation;
  put?: Operation;
  delete?: Operation;
  patch?: Operation;
  [key: string]: unknown;
};

type Operation = {
  parameters?: Parameter[];
  responses?: Record<string, Response>;
};

type Parameter = {
  name: string;
  in: string;
  required?: boolean;
  schema?: Schema;
};

type Response = {
  content?: Record<string, { schema?: Schema }>;
  schema?: Schema;
};

type Schema = {
  type?: string;
  required?: string[];
  properties?: Record<string, Schema>;
  items?: Schema;
  $ref?: string;
};

/**
 * Find deleted endpoints
 */
function findDeletedEndpoints(
  oldDoc: OpenAPIDocument,
  newDoc: OpenAPIDocument
): BreakingChange[] {
  const changes: BreakingChange[] = [];
  const oldPaths = oldDoc.paths || {};
  const newPaths = newDoc.paths || {};

  for (const [path, methods] of Object.entries(oldPaths)) {
    if (!newPaths[path]) {
      changes.push({
        type: 'endpoint',
        severity: 'critical',
        description: `Endpoint '${path}' was deleted`,
        location: path,
      });
      continue;
    }

    // Check for deleted HTTP methods
    for (const method of ['get', 'post', 'put', 'delete', 'patch']) {
      if (methods[method] && !(newPaths[path] as PathItem)[method]) {
        changes.push({
          type: 'endpoint',
          severity: 'critical',
          description: `Method ${method.toUpperCase()} '${path}' was deleted`,
          location: `${method.toUpperCase()} ${path}`,
        });
      }
    }
  }

  return changes;
}

/**
 * Find changed HTTP methods (e.g., GET became POST)
 */
function findChangedMethods(
  oldDoc: OpenAPIDocument,
  newDoc: OpenAPIDocument
): BreakingChange[] {
  // This would require more complex analysis
  // For MVP, we focus on deletions
  return [];
}

/**
 * Find removed required parameters
 */
function findRemovedRequiredParameters(
  oldDoc: OpenAPIDocument,
  newDoc: OpenAPIDocument
): BreakingChange[] {
  const changes: BreakingChange[] = [];
  const oldPaths = oldDoc.paths || {};
  const newPaths = newDoc.paths || {};

  for (const [path, oldMethods] of Object.entries(oldPaths)) {
    const newMethods = newPaths[path];
    if (!newMethods) continue;

    for (const [method, operation] of Object.entries(oldMethods)) {
      if (!operation || typeof operation !== 'object') continue;
      const op = operation as Operation;
      const newOp = (newMethods as PathItem)[method] as Operation;
      if (!newOp) continue;

      const oldParams = op.parameters || [];
      const newParams = newOp.parameters || [];

      for (const param of oldParams) {
        if (param.required) {
          const stillExists = newParams.some(
            (p) => p.name === param.name && p.in === param.in
          );
          if (!stillExists) {
            changes.push({
              type: 'parameter',
              severity: 'critical',
              description: `Required parameter '${param.name}' (${param.in}) was removed from ${method.toUpperCase()} ${path}`,
              location: `${method.toUpperCase()} ${path}`,
            });
          }
        }
      }
    }
  }

  return changes;
}

/**
 * Find response type changes
 */
function findResponseTypeChanges(
  oldDoc: OpenAPIDocument,
  newDoc: OpenAPIDocument
): BreakingChange[] {
  const changes: BreakingChange[] = [];
  const oldPaths = oldDoc.paths || {};
  const newPaths = newDoc.paths || {};

  for (const [path, oldMethods] of Object.entries(oldPaths)) {
    const newMethods = newPaths[path];
    if (!newMethods) continue;

    for (const [method, operation] of Object.entries(oldMethods)) {
      if (!operation || typeof operation !== 'object') continue;
      const op = operation as Operation;
      const newOp = (newMethods as PathItem)[method] as Operation;
      if (!newOp) continue;

      const oldResponses = op.responses || {};
      const newResponses = newOp.responses || {};

      // Check for deleted response codes
      for (const code of Object.keys(oldResponses)) {
        if (!newResponses[code]) {
          changes.push({
            type: 'response',
            severity: code === '200' || code === 'default' ? 'major' : 'minor',
            description: `Response code ${code} was removed from ${method.toUpperCase()} ${path}`,
            location: `${method.toUpperCase()} ${path}`,
          });
        }
      }
    }
  }

  return changes;
}

/**
 * Find breaking changes in schemas
 */
function findSchemaBreakingChanges(
  oldDoc: OpenAPIDocument,
  newDoc: OpenAPIDocument
): BreakingChange[] {
  const changes: BreakingChange[] = [];
  const oldSchemas = oldDoc.components?.schemas || oldDoc.definitions || {};
  const newSchemas = newDoc.components?.schemas || newDoc.definitions || {};

  for (const [name, oldSchema] of Object.entries(oldSchemas)) {
    const newSchema = newSchemas[name];
    if (!newSchema) {
      changes.push({
        type: 'schema',
        severity: 'major',
        description: `Schema '${name}' was deleted`,
        location: `components.schemas.${name}`,
      });
      continue;
    }

    // Check for removed required properties
    const oldRequired = oldSchema.required || [];
    const newRequired = newSchema.required || [];
    const removedRequired = oldRequired.filter((r) => !newRequired.includes(r));

    if (removedRequired.length > 0) {
      changes.push({
        type: 'schema',
        severity: 'major',
        description: `Required property(ies) '${removedRequired.join(', ')}' removed from schema '${name}'`,
        location: `components.schemas.${name}`,
      });
    }
  }

  return changes;
}

/**
 * Generate human-readable diff summary
 */
export function formatBreakingChanges(changes: BreakingChange[]): string {
  if (changes.length === 0) {
    return 'No breaking changes detected.';
  }

  const bySeverity = {
    critical: changes.filter((c) => c.severity === 'critical'),
    major: changes.filter((c) => c.severity === 'major'),
    minor: changes.filter((c) => c.severity === 'minor'),
  };

  const lines: string[] = [];

  if (bySeverity.critical.length > 0) {
    lines.push(`\n🔴 Critical Changes (${bySeverity.critical.length}):`);
    for (const change of bySeverity.critical) {
      lines.push(`  • ${change.description}`);
    }
  }

  if (bySeverity.major.length > 0) {
    lines.push(`\n🟠 Major Changes (${bySeverity.major.length}):`);
    for (const change of bySeverity.major) {
      lines.push(`  • ${change.description}`);
    }
  }

  if (bySeverity.minor.length > 0) {
    lines.push(`\n🟡 Minor Changes (${bySeverity.minor.length}):`);
    for (const change of bySeverity.minor) {
      lines.push(`  • ${change.description}`);
    }
  }

  return lines.join('\n');
}
