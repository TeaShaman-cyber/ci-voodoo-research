import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { generateRitual, validateRequest } from './generator.mjs';

function jsonText(value) {
  return JSON.stringify(value, null, 2) + '\n';
}

function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

function canonicalRequest(request) {
  return {
    schema: request.schema,
    mode: request.mode,
    target_class: request.target_class,
    intensity: request.intensity,
    ritual_style: request.ritual_style,
    incident_ref: request.incident_ref,
    seed: request.seed ?? null,
    persist: false
  };
}

export async function runCanonical({ request: input, outDir, runnerRevision = 'LOCAL' }) {
  if (typeof outDir !== 'string' || outDir.length === 0) {
    throw new TypeError('outDir must be a non-empty string');
  }

  validateRequest(input);
  const request = canonicalRequest(input);
  const result = generateRitual(request);

  const requestText = jsonText(request);
  const resultText = jsonText(result);
  const requestHash = sha256(requestText);
  const resultHash = sha256(resultText);

  const receipt = {
    schema: 'ci-voodoo.receipt.v1',
    request_id: `ci-${requestHash.slice(0, 16)}`,
    generator_version: result.generator_version,
    policy_snapshot: result.policy_snapshot,
    request_hash: requestHash,
    seed: result.seed,
    runner_revision: runnerRevision,
    result_hash: resultHash,
    artifact_location: 'result.json',
    status: 'COMPLETED'
  };

  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, 'request.json'), requestText, 'utf8');
  await writeFile(join(outDir, 'result.json'), resultText, 'utf8');
  await writeFile(join(outDir, 'receipt.json'), jsonText(receipt), 'utf8');

  return receipt;
}
