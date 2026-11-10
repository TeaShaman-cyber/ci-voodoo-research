import { validateRequest } from './generator.mjs';

const COMMAND = '/ci-voodoo\n';
const MAX_COMMENT_BYTES = 4096;
const ALLOWED_FIELDS = new Set([
  'schema',
  'mode',
  'target_class',
  'intensity',
  'ritual_style',
  'incident_ref',
  'seed',
  'persist'
]);

export function parseGithubCommentRequest(body) {
  if (typeof body !== 'string') {
    throw new TypeError('GitHub comment body must be a string');
  }
  if (Buffer.byteLength(body, 'utf8') > MAX_COMMENT_BYTES) {
    throw new TypeError('GitHub comment body is too large');
  }
  if (!body.startsWith(COMMAND)) {
    throw new TypeError('GitHub comment must start with /ci-voodoo followed by a newline');
  }

  const payloadText = body.slice(COMMAND.length);
  let request;
  try {
    request = JSON.parse(payloadText);
  } catch {
    throw new TypeError('invalid JSON payload after /ci-voodoo');
  }

  if (!request || typeof request !== 'object' || Array.isArray(request)) {
    throw new TypeError('request must be a JSON object');
  }

  for (const field of Object.keys(request)) {
    if (!ALLOWED_FIELDS.has(field)) {
      throw new TypeError(`unknown field: ${field}`);
    }
  }

  validateRequest(request);

  return {
    schema: request.schema,
    mode: request.mode,
    target_class: request.target_class,
    intensity: request.intensity,
    ritual_style: request.ritual_style,
    incident_ref: request.incident_ref,
    seed: request.seed,
    persist: false
  };
}
