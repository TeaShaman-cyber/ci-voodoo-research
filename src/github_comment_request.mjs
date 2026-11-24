import { marked } from 'marked';

import { validateRequest } from './generator.mjs';

const COMMAND = '/ci-voodoo';
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

function invalidPayload() {
  return new TypeError('invalid JSON payload after /ci-voodoo');
}

function extractPayloadText(body) {
  const commandMatch = /^\/ci-voodoo(?:\r\n|\n)/.exec(body);
  if (!commandMatch) {
    throw new TypeError('GitHub comment must start with /ci-voodoo followed by a newline');
  }
  return body.slice(commandMatch[0].length);
}

function parsePayload(payloadText) {
  try {
    return JSON.parse(payloadText);
  } catch {
    // Fall through to the narrow Markdown envelope accepted by the native ingress.
  }

  const tokens = marked.lexer(payloadText);
  const meaningfulTokens = tokens.filter((token) => token.type !== 'space');
  if (meaningfulTokens.length !== 1) {
    throw invalidPayload();
  }

  const [token] = meaningfulTokens;
  const language = typeof token.lang === 'string' ? token.lang.trim().toLowerCase() : '';
  if (
    token.type !== 'code' ||
    token.codeBlockStyle === 'indented' ||
    (language !== '' && language !== 'json')
  ) {
    throw invalidPayload();
  }

  try {
    return JSON.parse(token.text);
  } catch {
    throw invalidPayload();
  }
}

export function parseGithubCommentRequest(body) {
  if (typeof body !== 'string') {
    throw new TypeError('GitHub comment body must be a string');
  }
  if (Buffer.byteLength(body, 'utf8') > MAX_COMMENT_BYTES) {
    throw new TypeError('GitHub comment body is too large');
  }

  const request = parsePayload(extractPayloadText(body));

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
};
