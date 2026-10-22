# CI-voodoo plugin architecture v0

Issue: #4

Status: DESIGN / IMPLEMENTATION_NOT_YET_PROVEN

## Priority correction

The plugin must be useful **without** implicit auto-triggering.

Auto-trigger is an optional UX enhancement. Failure to auto-trigger does not block the plugin, the generator, the GitHub runner, image generation, or release acceptance.

Core path:

    explicit invocation
    -> CI-voodoo skill/plugin
    -> generation runtime
    -> optional GitHub runner for reproducible execution/receipts
    -> optional native image generation when available

Bonus path:

    semantic frustration match
    -> implicit skill activation
    -> same core path

Therefore:

    EXPLICIT INVOCATION = REQUIRED
    GENERATION = REQUIRED
    RUNNER = REQUIRED FOR CANONICAL/REPRODUCIBLE MODE
    IMAGE ADAPTER = OPTIONAL CAPABILITY
    AUTO_TRIGGER = OPTIONAL BONUS

## Design objective

Build a small model-facing plugin that can:

1. respond reliably when explicitly invoked;
2. generate CI-voodoo text/artifacts through a versioned generator contract;
3. dispatch reproducible canonical generation through a GitHub-backed runner;
4. produce receipts for canonical runs;
5. optionally render images through a native host capability;
6. optionally auto-trigger on a narrow semantic class of OpenAI/ChatGPT engineering frustration;
7. keep generation, persistence, and publication as separate authority boundaries.

The Sonar precedent remains useful for the optional auto-trigger layer:

    DISCOVERY != AUTO_TRIGGER

But plugin success is defined independently:

    EXPLICIT INVOCATION
    -> EXECUTION
    -> VERIFICATION

and, when canonical mode is requested:

    EXECUTION
    -> RECEIPT

## Component model

    explicit user invocation
            |
            v
    CI-voodoo skill/plugin
      |             |                 |
      | fast        | canonical       | image
      v             v                 v
    chat        generation runtime   image brief
    artifact         |                 |
                     v                 +-> native image tool if available
                plugin MCP
                ritual.*
                     |
                     v
                GitHub Actions
                versioned runner
                tests + receipts

Optional bonus:

    contextual frustration
            |
            v
    semantic skill auto-trigger
            |
            +-> same CI-voodoo skill/plugin path

The optional trigger layer must never become a dependency of the core path.

## Core behavior

### Explicit invocation

This is the normative entrypoint.

Examples include:

- user invokes CI-voodoo by name;
- user asks for a ritual, curse, chant, poster, caption, profanity artifact, or image;
- user requests a canonical/reproducible run.

Explicit invocation must work regardless of whether semantic auto-trigger works on the host.

### Fast generation

For ordinary interactive use, the skill can generate text directly in the ChatGPT runtime.

This path is optimized for speed and humor, not for canonical reproducibility.

### Canonical generation

Canonical mode uses the versioned generator/runner contract.

Required invariant:

    chat-generated variant != canonical receipt

Canonical generation exists so an artifact can be reproduced, inspected, tested, and traced to a generator/runner revision.

## Generator runtime

The generator is a first-class core component, not an implementation detail of auto-triggering.

Prefer a small pure library with structured input/output over an agent inside the runner.

Reasons:

- deterministic tests;
- seeded variation where useful;
- low execution cost;
- easier policy linting;
- reproducible receipts;
- independence from hidden model routing.

Candidate input:

    schema: ci-voodoo.request.v1
    mode: micro | text | canonical | image
    target_class: BUG | SYSTEM | PROCESS | VENDOR_ABSTRACT | ROLE_ABSTRACT
    intensity: 0..3
    ritual_style: plain-rage | folk-curse | ci-voodoo | cato
    incident_summary: string
    seed: nullable
    persist: false

Candidate output:

    schema: ci-voodoo.result.v1
    text: string
    risk: LOW | MEDIUM | HIGH | BLOCK
    policy_snapshot: string
    seed: nullable
    generator_version: semver

## GitHub runner

GitHub Actions is part of the canonical/reproducible path.

Recommended model:

    plugin MCP ritual.run
    -> repository_dispatch
    -> workflow
    -> validate request schema
    -> run versioned generator
    -> run policy lint
    -> emit artifact
    -> emit receipt

GitHub itself is an implementation detail behind our plugin surface, not a required user-side connector dependency.

Do not auto-commit generated artifacts in v0.

Ordinary canonical runs should emit workflow artifacts. Durable repository persistence, if added later, should remain a separate action.

### Planned MCP tools

    ritual.plan      normalize/classify request
    ritual.run       dispatch canonical generation
    ritual.status    read execution state
    ritual.artifact  read result + receipt

A later persistence/promotion tool may be added, but it is not part of v0.

### Receipt

Canonical runs preserve:

    request_id
    generator_version
    policy_snapshot
    input_hash
    seed
    runner_revision
    result_hash
    artifact_location
    status

Success requires observable runner completion and receipt readback.

## Image path

The plugin does not need to own an image model.

The skill/generator can always emit an image brief.

Then:

    native image capability AVAILABLE
    + user requested render
    -> use host-native image generation

    native image capability UNAVAILABLE
    -> return image brief/prompt only

Image support is useful but not required for core text/canonical functionality.

## Auto-trigger: optional bonus

Auto-trigger is a convenience feature only.

It may improve ergonomics by recognizing the recurring pattern:

    OpenAI/ChatGPT engineering failure
    +
    visible frustration / profanity / dark engineering humor

and loading the skill without an explicit CI-voodoo invocation.

However:

    AUTO_TRIGGER FAIL
    !=
    PLUGIN FAIL

A host that exposes the plugin only by explicit invocation is still fully supported.

### Auto-trigger evaluation

When tested, preserve the Sonar distinction:

    DISCOVERY
    AUTO_TRIGGER

Use positive/contextual/negative fixtures and measure over-trigger separately from under-trigger.

But these tests are non-blocking for the core release.

## Authority boundary

Invocation or auto-trigger grants generation scope only.

Neither implies:

- public posting;
- tagging people;
- sending messages;
- repository promotion;
- recurring automation;
- permission changes.

Core invariant:

    generate != persist != publish

## Acceptance

### Required for first useful release

- portable plugin package validates;
- explicit invocation loads the CI-voodoo skill;
- text generation works;
- generator request/result schema is versioned;
- canonical runner executes reproducibly;
- runner emits a verifiable receipt;
- profanity/public-text constraints are enforced;
- no auto-posting or hidden publication;
- failure states are reported honestly.

### Optional / non-blocking

- implicit semantic auto-trigger;
- clean-session trigger-rate optimization;
- native image rendering;
- publication adapters.

## Implementation order

### Phase A — explicit skill + generator contract

- validate plugin packaging;
- prove explicit invocation;
- implement request/result schema;
- implement pure generator and tests.

### Phase B — GitHub canonical runner

- workflow/manual runner;
- policy lint;
- artifacts;
- receipts;
- runner readback.

### Phase C — plugin MCP facade

- ritual.plan/run/status/artifact;
- GitHub Actions remains internal implementation detail;
- verify action/receipt boundaries.

### Phase D — native image adapter

- image brief contract;
- use native image generation when exposed;
- prompt-only fallback otherwise.

### Phase E — optional auto-trigger experiment

- reuse Sonar discovery/auto-trigger methodology;
- positive/contextual/negative fixtures;
- measure trigger rates;
- ship only if it improves ergonomics.

Auto-trigger failure does not block any earlier phase.

## Decision summary

The actual product is:

    skill/plugin
    + generator runtime
    + GitHub canonical runner
    + receipts

Native image generation is an optional capability.

Semantic auto-trigger is a bonus.

The plugin remains useful even if auto-trigger never works on a given host.
