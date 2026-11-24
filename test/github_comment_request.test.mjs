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

test('parses the same canonical request from a fenced json Markdown block', () => {
  const body = '/ci-voodoo\n' + '```json\n' + JSON.stringify(request, null, 2) + '\n```';
  assert.deepEqual(parseGithubCommentRequest(body), request);
});

test('accepts an unlabeled single fenced code block', () => {
  const body = '/ci-voodoo\n' + '```\n' + JSON.stringify(request) + '\n```';
  assert.deepEqual(parseGithubCommentRequest(body), request);
});

test('accepts CRLF and surrounding blank space around one fenced JSON block', () => {
  const json = JSON.stringify(request, null, 2).replaceAll('\n', '\r\n');
  const body = '/ci-voodoo\r\n\r\n```json\r\n' + json + '\r\n```\r\n';
  assert.deepEqual(parseGithubCommentRequest(body), request);
});

test('rejects prose around a fenced JSON block', () => {
  const body = '/ci-voodoo\nplease parse this\n```json\n' + JSON.stringify(request) + '\n```';
  assert.throws(() => parseGithubCommentRequest(body), /invalid JSON/i);
});

test('rejects multiple fenced code blocks as ambiguous', () => {
  const body = '/ci-voodoo\n```json\n' + JSON.stringify(request) + '\n```\n```json\n{}\n```';
  assert.throws(() => parseGithubCommentRequest(body), /invalid JSON/i);
});

test('rejects unsupported fenced code languages', () => {
  const body = '/ci-voodoo\n```javascript\n' + JSON.stringify(request) + '\n```';
  assert.throws(() => parseGithubCommentRequest(body), /invalid JSON/i);
});

test('preserves unknown-field rejection after Markdown normalization', () => {
  const payload = JSON.stringify({ ...request, raw_incident: 'do not persist this' });
  const body = '/ci-voodoo\n```json\n' + payload + '\n```';
  assert.throws(() => parseGithubCommentRequest(body), /unknown field/i);
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
