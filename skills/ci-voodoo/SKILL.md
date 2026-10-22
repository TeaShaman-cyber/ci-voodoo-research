---
name: ci-voodoo
description: Use when the user invokes CI-voodoo or wants to turn a real OpenAI/ChatGPT engineering incident—lost messages, broken renderers, tool failures, flaky CI, permission regressions, model-routing glitches, or similar platform failures—into an automated profanity/satire artifact. Generate a targeted engineering curse or complaint, optionally produce a reproducible canonical receipt, and prepare publishable X copy or an image; publication remains a separate authorized action. Standalone ritual, curse, chant, poster, caption, and related artifact requests are also supported. Implicit auto-triggering is optional and must never be required for the skill to work.
---

# CI Voodoo

CI-voodoo automates profanity/satire responses to real OpenAI/ChatGPT engineering failures. Its primary use case is not decorative ritual generation; it turns an observed platform incident into a targeted engineering complaint or curse, with reproducibility and publication preparation as optional later stages.

It remains explicitly invokable first. Implicit auto-triggering is an optional convenience.

The core contract is:

    OpenAI/ChatGPT engineering failure
    -> structured incident/target
    -> profanity/satire artifact
    -> optional canonical receipt
    -> optional publication-ready X artifact

Publishing itself remains a separate authorized action. Native image generation is an optional host capability, not a core dependency.

## Explicit mode

Explicit invocation is the normative path and must always work on supported hosts.

Examples:

- invoke CI-voodoo on a real OpenAI/ChatGPT incident such as a lost message, broken renderer, tool failure, flaky CI, permission regression, or routing glitch;
- ask to turn that incident into a curse, complaint, caption, poster copy, or profanity artifact;
- request a canonical/reproducible run;
- request a publication-ready X artifact or CI-voodoo image;
- ask for standalone ritual/curse/chant output when no incident context is needed.

Produce the requested artifact at the requested depth.

## Optional implicit mode

If the host selects this skill automatically from context, use it only when the user is clearly frustrated specifically by ChatGPT/OpenAI engineering/runtime failures and the tone already permits dark engineering humor.

In implicit mode:

1. do not interrupt the primary task;
2. add at most one compact CI-voodoo garnish unless the user asks for more;
3. target the bug, system, rollout, process, or abstract vendor behavior;
4. never treat implicit loading as authority for external actions.

If the host never auto-triggers this skill, nothing is broken.

## Negative controls for implicit mode

Do not surface CI-voodoo merely because:

- the user swears about an unrelated person or situation;
- profanity appears inside a quote or source;
- the user is discussing profanity, religion, Vodou, or folklore academically;
- the user is doing ordinary debugging with no frustration/satire signal;
- the user explicitly asks for a serious, non-humorous response;
- the situation is high-stakes and satire would interfere with the task.

These controls are about the optional implicit path. They do not prevent explicit invocation.

## Default target

Prefer:

    BUG
    -> SYSTEM
    -> PROCESS
    -> VENDOR_ABSTRACT
    -> ROLE_ABSTRACT

Do not automatically escalate to a named-person target.

For profanity and public-text constraints, follow:

    references/x-compatible-profanity-generator.md

## Output modes

### micro

One short ritual line.

### text

A short ritual, curse, caption, chant, bug exorcism, poster copy, or related text artifact.

### canonical

Prepare and, when the runner exists, execute a structured canonical request.

Canonical requests use:

    schema: ci-voodoo.request.v1
    mode: text
    target_class: SYSTEM
    intensity: 0..3
    ritual_style: ci-voodoo
    incident_ref: sha256:<opaque digest>
    seed: nullable
    persist: false

Canonical success requires a runner receipt. A chat-generated line alone is not a canonical receipt.

### image

Image generation is outside canonical runner v1. Produce an image brief containing:

- subject;
- ritual motif;
- engineering target;
- text/caption if any;
- composition;
- mood;
- exclusions.

If the current host exposes native image generation and the user requested rendering, use it.

Otherwise return the image brief/prompt.

## Planned canonical runner

Expected plugin-facing surface:

    ritual.plan
    ritual.run
    ritual.status
    ritual.artifact

The implementation may use GitHub Actions internally.

GitHub Actions is a runner implementation detail, not a hidden user-side plugin dependency.

## Authority boundary

Generation is separate from persistence and publication.

    generate != persist != publish

Neither explicit invocation nor implicit auto-trigger authorizes:

- posting to X or another public surface;
- tagging people;
- sending messages;
- unrelated repository mutations;
- recurring automation;
- permission changes.

## Receipt

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

## Success

The skill succeeds when explicit invocation reliably produces the requested CI-voodoo artifact, and canonical mode can produce a verifiable receipt when requested.

Implicit auto-triggering is a bonus and is not part of the success requirement.
