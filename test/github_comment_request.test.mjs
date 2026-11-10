import test from 'node:test';
import assert from 'node:assert/strict';

import { parseGithubCommentRequest } from '../src/github_comment_request.mjs';

const request = {
  schema: 'ci-voodoo.request.v1',
  mode: 'text',
  target_class: 'SYSTEM',
  intensity: 2,
  ritual_style: 'ci-voodoo',
  incident_ref: 'sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  seed: null,
  persist: false
};

test('parses an exact /ci-voodoo command followed by request JSON', () => {
  const body = '/ci-voodoo\n' + JSON.stringify(request);
  assert.deepEqual(parseGithubCommentRequest(body), request);
});

test('rejects unknown request fields instead of silently dropping them', () => {
  const body = '/ci-voodoo\n' + JSON.stringify({ ...request, raw_incident: 'do not persist this' });
  assert.throws(() => parseGithubCommentRequest(body), /unknown field/i);
});

test('rejects comments that are not explicit ci-voodoo invocations', () => {
  assert.throws(() => parseGithubCommentRequest(JSON.stringify(request)), /\/ci-voodoo/);
});

test('rejects trailing content after the JSON payload', () => {
  const body = '/ci-voodoo\n' + JSON.stringify(request) + '\nplease also publish this';
  assert.throws(() => parseGithubCommentRequest(body), /invalid JSON/i);
});

test('rejects oversized comment bodies', () => {
  const body = '/ci-voodoo\n' + 'x'.repeat(5000);
  assert.throws(() => parseGithubCommentRequest(body), /too large/i);
});
