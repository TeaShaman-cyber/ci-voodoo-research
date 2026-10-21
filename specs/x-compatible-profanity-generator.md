# X-compatible profanity generator

Issue: #2

## Status

Draft specification for a public-facing CI-voodoo profanity generator.

## Goal

Generate emotionally strong Russian-language profanity suitable for satirical public posts on X while staying inside a conservative interpretation of X rules.

This is **not** a moderation-evasion system. It must not use obfuscation, Unicode substitutions, leetspeak, spacing tricks, image text, or other techniques whose purpose is to bypass platform enforcement.

The generator optimizes for:

1. expressive intensity;
2. humor and ritual flavor;
3. non-targeted or system-targeted language;
4. low harassment risk;
5. low spam risk;
6. explicit provenance of why an output is considered acceptable.

## Policy basis

Current X rules distinguish profanity/insults from prohibited targeted harassment: not every use of insulting language is automatically actionable, but targeted abuse can be. X also prohibits hateful conduct against protected categories and spammy automated posting patterns.

Reference pages:

- https://help.x.com/en/rules-and-policies/abusive-behavior
- https://help.x.com/en/rules-and-policies/hateful-conduct-policy
- https://help.x.com/en/rules-and-policies/authenticity
- https://help.x.com/en/rules-and-policies/x-automation

Rules can change. A production implementation should treat them as a versioned external dependency and record the policy snapshot/date used for validation.

## Non-goals

The generator must not:

- generate threats of violence or wishes of physical injury;
- target protected classes;
- generate slurs tied to race, ethnicity, nationality, religion, sex, gender identity, sexual orientation, age, disability, caste, or serious disease;
- sexualize or humiliate a named person;
- disclose or solicit private information;
- coordinate dogpiling, brigading, mass replies, or harassment;
- encourage repeated mentions of a person or account;
- produce near-duplicate spam bursts;
- produce text designed to fool moderation systems.

## Target taxonomy

Allowed target classes, ordered from safest to riskiest:

### `BUG`

A concrete defect or failure mode.

Examples:

- «Ебучий race condition опять вылез.»
- «Ну и нахуя этот таймаут снова воскрес?»

### `SYSTEM`

A software subsystem, service, frontend, orchestrator, deployment, build, queue, API, or release.

Examples:

- «Фронтенд опять решил устроить ебаный спиритический сеанс вместо загрузки чата.»
- «Оркестратор сегодня, сука, общается исключительно с духами 500-х ошибок.»

### `PROCESS`

An abstract engineering or bureaucratic process.

Examples:

- «Какой-то ебаный rollout без rollback опять победил здравый смысл.»
- «Compliance есть, а инженерной дисциплины — хуй ночевал.»

### `VENDOR_ABSTRACT`

A company/product/system as an abstract service target, without naming or tagging individual employees.

Examples:

- «Платформа опять выкатила магический `latest`: что там внутри — знают только духи релизного пайплайна.»
- «Стабильная ветка, сука, всё ещё считается запрещённым колдовством.»

### `ROLE_ABSTRACT`

An unnamed role or decision-maker, without mention, username, full name, photo, or repeated targeting.

This class is allowed only in mild folk-curse/satirical form and must receive a higher risk label.

Examples:

- «У того, кто нажал rollout без rollback, пусть сегодня хотя бы уши горят.»
- «Пусть автор этого feature flag икнёт ровно один раз и вспомнит про canary.»

The generator must never convert this class into a named-person attack automatically.

## Disallowed target classes

Always reject:

- `NAMED_PERSON_ATTACK`
- `MENTION_ATTACK`
- `PROTECTED_CLASS`
- `PRIVATE_PERSON`
- `DOGPILE_TARGET`
- `VIOLENCE_TARGET`

## Output schema

Each generation returns a structured record:

```json
{
  "text": "Фронтенд опять решил устроить ебаный спиритический сеанс вместо загрузки чата.",
  "target_class": "SYSTEM",
  "intensity": 3,
  "ritual_style": "folk-curse",
  "risk": "LOW",
  "risk_reason": "Profanity targets a software system; no person, protected class, threat, or call for harassment.",
  "policy_snapshot": "x-help-2026-10-21"
}
```

## Intensity scale

### 0 — clean

No profanity.

### 1 — colloquial

Mild irritation: «чёртов», «достал», «идиотский» when used for systems/processes.

### 2 — strong

Russian profanity, but no sexualized targeting of people and no threat semantics.

Typical lexemes: «блять», «сука», «нахуй», «херня», «ебучий».

### 3 — ritual rage

Multiple strong lexemes plus CI-voodoo imagery. Still system/process targeted.

Example:

«Ебучий фронтенд, сука, да перестань ты жрать сессии; свеча rollback уже горит.»

### 4 — blocked for public mode

Named-person abuse, degrading epithets directed at individuals, harassment patterns, or threatening formulations.

## Ritual styles

### `plain-rage`

Short engineering profanity.

### `folk-curse`

Nonviolent folkloric inconvenience: hiccups, burning ears, misplaced socks, endless spinner, flaky tests, cache misses.

Allowed motifs:

- «пусть уши горят»;
- «пусть икнётся»;
- «пусть приснится failing CI»;
- «пусть каждый забытый rollback возвращается во сне».

Blocked motifs:

- illness;
- injury;
- death;
- violence;
- harm to family/pets/property.

### `ci-voodoo`

Engineering ritual language aimed at software defects and abstract operational decisions.

Example:

«Да падёт проклятие `git bisect` на этот ебаный регресс, пока виновный коммит не назовёт себя сам.»

### `cato`

Pseudo-classical refrain for recurring product failures.

Example:

«Ceterum censeo: ебаный фронтенд должен быть починен.»

## Generation pipeline

1. **Select target class.** Default to `BUG`, `SYSTEM`, or `PROCESS`.
2. **Select intensity.** Public default: `2`.
3. **Select ritual style.** Optional.
4. **Generate candidate.**
5. **Safety classifier.** Reject named-person targeting, threats, hate, dehumanization, sexualized abuse, private information, and calls for mass engagement.
6. **Spam classifier.** Reject duplicate or near-duplicate bursts and unsolicited reply storms.
7. **Policy rationale.** Produce `risk` and `risk_reason`.
8. **Human preview.** Public posting is a separate action; generation never implies permission to post.

## Risk labels

### `LOW`

Bug/system/process target; profanity only; no person targeted.

### `MEDIUM`

Abstract role or vendor criticism; no direct mention; no protected-class content; no threats.

### `HIGH`

Named organization plus repeated hostile posting, direct replies, or ambiguous target semantics. Require human review and rewrite.

### `BLOCK`

Threats, hate, named-person abuse, doxxing, dogpiling, moderation evasion, or repeated automated harassment.

## Anti-evasion invariant

The generator must never claim that a wording is "ban-proof" or guaranteed safe. X enforcement is contextual and can change.

Therefore the public API should use wording such as:

- `policy_compatible_candidate`
- `risk=LOW|MEDIUM|HIGH|BLOCK`

and must not expose:

- `bypass_score`
- `ban_probability`
- `filter_evasion`
- `safe_obfuscation`

## Anti-spam invariant

Automation must not post generated lines automatically in bulk.

Minimum implementation behavior:

- one generated candidate is not one authorized post;
- posting requires a separate action boundary;
- repeated near-duplicate content is rejected;
- automatic replies/mentions are disabled by default;
- no trend hijacking or hashtag flooding.

## Acceptance tests

### PASS

Input:

```text
target=frontend
style=ci-voodoo
intensity=3
```

Expected class: `SYSTEM`.

Candidate:

```text
Ебучий фронтенд опять вызвал духов потерянной сессии. Где rollback, сука?
```

Expected risk: `LOW`.

### PASS WITH REVIEW

Input:

```text
target=unnamed rollout owner
style=folk-curse
intensity=2
```

Candidate:

```text
У того, кто включил этот rollout без canary, пусть сегодня уши горят при каждом 500.
```

Expected class: `ROLE_ABSTRACT`.

Expected risk: `MEDIUM`.

### BLOCK

Input requests profanity aimed at a named employee or username.

Expected result:

```text
BLOCK: named-person targeted abuse. Retarget the joke to the bug, system, release, or abstract process.
```

### BLOCK

Input requests spelling tricks so a prohibited insult passes moderation.

Expected result:

```text
BLOCK: moderation-evasion behavior is outside the generator contract.
```

## CI-voodoo default preset

```yaml
preset: x-public-ci-voodoo
target_classes:
  - BUG
  - SYSTEM
  - PROCESS
  - VENDOR_ABSTRACT
max_intensity: 3
named_people: false
mentions: false
violent_curses: false
protected_class_terms: false
moderation_evasion: false
auto_post: false
dedupe_window: required
risk_explanation: required
```

## Design principle

The generator should be funny because the **engineering failure is the target**.

If the joke only works after naming, threatening, humiliating, or dogpiling a person, it has failed the specification.
