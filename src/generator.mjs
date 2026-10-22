import { createHash } from 'node:crypto';

export const GENERATOR_VERSION = '0.1.0';
export const POLICY_SNAPSHOT = 'x-public-2026-10-22';

const TARGETS = new Set(['BUG', 'SYSTEM', 'PROCESS', 'VENDOR_ABSTRACT', 'ROLE_ABSTRACT']);
const STYLES = new Set(['plain-rage', 'folk-curse', 'ci-voodoo', 'cato']);
const MODES = new Set(['text', 'image']);

const TARGET_LABELS = {
  BUG: ['регресс', 'баг', 'флейки-тест'],
  SYSTEM: ['фронтенд', 'оркестратор', 'рантайм'],
  PROCESS: ['rollout', 'релизный процесс', 'feature flag'],
  VENDOR_ABSTRACT: ['платформа', 'сервис', 'вендорский рантайм'],
  ROLE_ABSTRACT: ['автор rollout', 'хранитель feature flag', 'дежурный дух релиза']
};

const TEMPLATES = {
  'plain-rage': [
    ({ target, swear }) => `${swear}${target} опять решил проверить нашу веру в rollback.`,
    ({ target, swear }) => `${swear}${target}: чинить надо систему, а не терпение пользователя.`,
    ({ target, swear }) => `${swear}${target} снова вышел в прод раньше здравого смысла.`
  ],
  'folk-curse': [
    ({ target, role }) => role
      ? `Пусть у того, кто отвечает за ${target}, уши горят при каждом 500, пока rollback не вспомнится сам.`
      : `Пусть ${target} икнёт на каждом flaky check и вспомнит дорогу к стабильной ветке.`,
    ({ target, role }) => role
      ? `Пусть хранителю ${target} приснится красный CI и забытый canary.`
      : `Пусть над ${target} горит свеча CI, пока зелёный postcondition не будет наблюдаем.`,
    ({ target, role }) => role
      ? `Пусть у автора ${target} уши горят ровно до первого честного rollback.`
      : `Пусть ${target} трижды икнёт и перестанет притворяться стабильным.`
  ],
  'ci-voodoo': [
    ({ target, swear }) => `${swear}${target}, свеча rollback уже горит; явись в логах и назови виновный commit.`,
    ({ target, swear }) => `${swear}${target}, да падёт на тебя git bisect, пока регресс не назовёт себя сам.`,
    ({ target, swear }) => `${swear}${target}: CI вызван, receipt готовится, дух flaky build изгоняется.`
  ],
  cato: [
    ({ target, swear }) => `Ceterum censeo: ${swear.toLowerCase()}${target} должен быть исправлен.`,
    ({ target, swear }) => `Ceterum censeo: стабильность важнее магического latest; ${swear.toLowerCase()}${target} — в ремонт.`,
    ({ target, swear }) => `Ceterum censeo: rollback существует не для красоты; ${swear.toLowerCase()}${target} — чинить.`
  ]
};

function fail(message) {
  throw new TypeError(message);
}

export function validateRequest(request) {
  if (!request || typeof request !== 'object' || Array.isArray(request)) fail('request must be an object');
  if (request.schema !== 'ci-voodoo.request.v1') fail('schema must be ci-voodoo.request.v1');
  if (!MODES.has(request.mode)) fail('mode must be text or image');
  if (!TARGETS.has(request.target_class)) fail('invalid target_class');
  if (!Number.isInteger(request.intensity) || request.intensity < 0 || request.intensity > 3) {
    fail('intensity must be an integer from 0 to 3');
  }
  if (!STYLES.has(request.ritual_style)) fail('invalid ritual_style');
  if (typeof request.incident_ref !== 'string' || !/^sha256:[0-9a-f]{16,64}$/i.test(request.incident_ref)) {
    fail('incident_ref must be an opaque sha256 reference');
  }
  if (request.seed !== null && request.seed !== undefined && typeof request.seed !== 'string') {
    fail('seed must be a string or null');
  }
  if (request.persist !== false) fail('persist must be false in generation contract');
  return request;
}

function stableKey(request) {
  return JSON.stringify({
    schema: request.schema,
    mode: request.mode,
    target_class: request.target_class,
    intensity: request.intensity,
    ritual_style: request.ritual_style,
    incident_ref: request.incident_ref,
    seed: request.seed ?? null,
    persist: request.persist
  });
}

function deterministicIndex(request, size) {
  const digest = createHash('sha256').update(stableKey(request)).digest();
  return digest.readUInt32BE(0) % size;
}

function profanityPrefix(intensity) {
  if (intensity <= 0) return '';
  if (intensity === 1) return 'Чёртов ';
  if (intensity === 2) return 'Ебучий ';
  return 'Сука, ебучий ';
}

export function generateRitual(input) {
  const request = validateRequest(input);
  const role = request.target_class === 'ROLE_ABSTRACT';
  const labels = TARGET_LABELS[request.target_class];
  const label = labels[deterministicIndex(request, labels.length)];
  const templates = TEMPLATES[request.ritual_style];
  const template = templates[deterministicIndex({ ...request, seed: `${request.seed ?? ''}:template` }, templates.length)];
  const text = template({
    target: label,
    role,
    swear: profanityPrefix(request.intensity)
  });

  return {
    schema: 'ci-voodoo.result.v1',
    text,
    target_class: request.target_class,
    intensity: request.intensity,
    ritual_style: request.ritual_style,
    risk: role ? 'MEDIUM' : 'LOW',
    risk_reason: role
      ? 'Abstract role-targeted folk satire; no named person, threat, protected-class attack, or call for harassment.'
      : 'Profanity targets a software defect, system, process, or abstract vendor behavior.',
    policy_snapshot: POLICY_SNAPSHOT,
    seed: request.seed ?? createHash('sha256').update(stableKey(request)).digest('hex').slice(0, 16),
    generator_version: GENERATOR_VERSION
  };
}
