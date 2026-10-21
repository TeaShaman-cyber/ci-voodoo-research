# CI-voodoo plugin architecture v0

Issue: #4

Status: DESIGN / IMPLEMENTATION_NOT_YET_PROVEN

## Design objective

Build a small model-facing plugin that can:

1. be discovered automatically from skill metadata;
2. activate on a narrow semantic class of OpenAI/ChatGPT reliability frustration;
3. produce a lightweight in-chat ritual immediately;
4. optionally dispatch a reproducible generator job;
5. optionally render an image through a native host capability;
6. keep generation, persistence, and publication as separate authority boundaries.

The design reuses the Sonar lesson from TeaShaman-cyber/theseus-sonar-skill#8:

    DISCOVERY != AUTO_TRIGGER != EXECUTION != PUBLICATION

## Current OpenAI constraints

As of 2026-10-21:

- plugin skills are discovered from name and description metadata;
- the full SKILL.md loads only after model selection;
- portable plugins use root plugin.json with the Agent Plugins schema;
- plugins may be skills-only or include MCP servers;
- public plugin tools should not depend on the model invoking another plugin or connector as a hidden implementation dependency;
- image generation is a separate host or tool capability and must be treated as available only when actually exposed by the runtime.

Primary references:

- https://developers.openai.com/plugins/concepts/skills
- https://developers.openai.com/plugins/build/skills
- https://developers.openai.com/plugins/build/plugins
- https://developers.openai.com/plugins/plugin-guidelines
- https://developers.openai.com/api/docs/guides/tools-image-generation

## Component model

    user message
        |
        v
    skill discovery metadata
        |
        | semantic match or explicit invocation
        v
    CI-voodoo SKILL.md
      |            |                |
      | fast       | reproducible   | image
      v            v                v
    chat       plugin MCP       native image
    artifact    ritual.*        capability
                   |
                   v
              GitHub Actions
              versioned generator
              tests and receipts

## Why the fast path stays skill-only

Most incidents do not need a remote job.

Example:

    сука опять чат съел последний ответ

The correct default behavior is:

    primary recovery or help
    +
    one compact ritual garnish

No network round-trip, GitHub write, Action run, or artifact persistence is needed.

This keeps the auto-trigger cheap and non-invasive.

## Why GitHub Actions sits behind our MCP surface

A public plugin should expose its own independently meaningful tools instead of instructing the model to invoke the GitHub connector as a hidden dependency.

Therefore:

    BAD
    skill -> call GitHub plugin workflow_dispatch

    GOOD
    skill -> ritual.run
               |
               +-> our server dispatches GitHub Actions internally

The model-facing contract remains stable if the runner later moves away from GitHub.

## Planned MCP tools

### ritual.plan

Pure normalization and classification.

Input fields:

    incident
    requested_mode: micro | text | canonical | image
    intensity: integer
    style: plain-rage | folk-curse | ci-voodoo | cato

Output fields:

    request
    risk: LOW | MEDIUM | HIGH | BLOCK
    reason

Intended annotations: read-only, non-destructive, bounded or private.

### ritual.run

Dispatch a reproducible job.

Required invariant:

    run != persist != publish

Default:

    persist = false

The tool returns a request_id and execution state. It does not imply that a public artifact exists.

### ritual.status

Read job state by request_id.

### ritual.artifact

Read the final generated artifact and receipt.

A later ritual.promote tool may be added for durable repository persistence, but it must remain a separate, explicitly authorized action because the repository is public.

## GitHub Actions runner

Recommended event model:

    MCP server
    -> repository_dispatch
    -> workflow
    -> validate request schema
    -> run versioned generator
    -> run policy lint
    -> emit artifact
    -> emit receipt

Do not auto-commit generated artifacts in v0.

Use GitHub Actions artifacts for ordinary runs. Durable repository promotion, if implemented later, should create a branch and PR under explicit authority.

### Artifact set

    request.json
    result.json
    receipt.json
    optional image-brief.json

### Receipt fields

    schema: ci-voodoo.receipt.v1
    request_id: uuid
    generator_version: semver
    runner_revision: git-sha
    policy_snapshot: string
    input_hash: sha256
    seed: nullable
    result_hash: sha256
    status: COMPLETED | BLOCKED | FAILED

## Generator runtime

Prefer a small pure library over an agent inside the runner.

Reasons:

- deterministic tests;
- seeded variation;
- cheap execution;
- no hidden model-routing dependency;
- easier policy linting;
- reproducible receipts.

The chat model can still create free-form variants in fast mode. Canonical mode uses the versioned generator.

Candidate implementation language: TypeScript, because the future MCP server and JSON-schema contracts naturally fit the same toolchain. This is a design preference, not an invariant.

## Image adapter

The plugin does not own an image model in v0.

The skill always knows how to emit image-brief.v1.

Then:

    native image capability AVAILABLE
    + user asked for an image or render
    -> render through host capability

    native image capability UNAVAILABLE
    -> return image brief or prompt only

Never claim that a native capability exists merely because the plugin supports image briefs.

This keeps the plugin portable across ChatGPT and Codex surfaces with different capabilities.

## Auto-trigger design

The auto-trigger mechanism is metadata selection, not a deterministic event hook.

Therefore the trigger must be evaluated empirically.

### Semantic positive region

Require both:

    A. target or topic
       OpenAI/ChatGPT platform engineering or runtime reliability failure

    B. conversational fit
       explicit frustration, profanity, or dark engineering humor
       OR explicit CI-voodoo invocation

Examples of topic signals:

- lost response, history, or state;
- frontend stuck, spinner, or render failure;
- unexpected model switching;
- unstable tools or connectors;
- regression after rollout;
- hidden or latest-style runtime drift.

### Negative region

Do not trigger on:

- unrelated profanity;
- anger at a private person;
- quoted profanity;
- academic discussion of Vodou or folklore;
- ordinary debugging;
- requests for a serious non-humorous incident response;
- high-stakes safety, legal, or medical situations where satire would distract.

### Implicit output budget

Implicit trigger may add at most one compact ritual line after the substantive answer.

Full artifacts require explicit request or clear continuation.

This protects attention and prevents the plugin from becoming an annoying personality overlay.

## Consent and authority

The installed plugin plus the user preference for implicit CI-voodoo grants standing authority only for low-consequence in-chat generation.

Standing authority does not include publication.

    AUTO_TRIGGER
    -> local text or image brief: allowed

    RUNNER
    -> may execute when explicitly requested or already covered by project workflow

    PERSIST TO PUBLIC REPO
    -> explicit or durable project authority required

    POST TO X or external social surface
    -> separate explicit action boundary

Every consequential runner action should produce an action receipt.

## Evaluation plan

Follow the Sonar split:

    DISCOVERY
    AUTO_TRIGGER
    EXECUTION
    CAPABILITY_ADAPTER

Test each independently.

### Discovery

Verify a clean host exposes the skill metadata.

### Auto-trigger

Use positive, contextual, and negative fixtures from:

    skills/ci-voodoo/references/trigger-evals.md

Track both:

    under-trigger
    over-trigger

### Execution

Test the pure generator independently from host model behavior.

### Image capability

Probe whether the host exposes native image generation. Do not substitute assumption for observation.

## Phased implementation

### Phase A - skill-only probe

- package plugin;
- install privately;
- clean-session discovery tests;
- positive and negative trigger evals;
- no MCP.

### Phase B - deterministic generator

- add pure generator library;
- local tests;
- GitHub Actions manual runner;
- receipts.

### Phase C - MCP dispatcher

- expose ritual.plan, ritual.run, ritual.status, and ritual.artifact;
- runner remains internal implementation detail;
- test permission and receipt boundary.

### Phase D - native image adapter

- test on ChatGPT surfaces that expose image generation;
- retain prompt-only fallback.

### Phase E - optional publication adapters

Out of scope until explicitly designed.

No auto-posting is part of v0.

## Decision summary

The smallest useful plugin is:

    portable plugin
    + one narrow auto-trigger skill

The smallest reproducible extension is:

    skill
    + our MCP facade
    + GitHub Actions runner

Native image generation is an optional host capability, not a hard dependency.

Core invariant:

The joke can auto-trigger; external consequences cannot.
