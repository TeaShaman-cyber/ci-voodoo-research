---
name: ci-voodoo
description: Use when the user invokes CI-voodoo or wants to turn a real OpenAI/ChatGPT engineering incident—lost messages, broken renderers, tool failures, flaky CI, permission regressions, model-routing glitches, or similar platform failures—into an automated profanity/satire artifact. Generate a targeted engineering curse or complaint, optionally produce a reproducible canonical receipt, and prepare publishable X copy or an image; publication remains a separate authorized action. Standalone ritual, curse, chant, poster, caption, and related artifact requests are also supported. Implicit auto-triggering is optional and must never be required for the skill to work.
---

# CI Voodoo

CI-voodoo automates profanity/satire responses to real OpenAI/ChatGPT engineering failures. Its primary use case is not decorative ritual generation; it turns an observed platform incident into a targeted engineering complaint or curse, with reproducibility and publication preparation as optional later stages.

It remains explicitly invokable first. Implicit auto-triggering is an optional convenience.

The core contract for a real OpenAI/ChatGPT incident is:

    OpenAI/ChatGPT engineering failure
    -> structured incident/target
    -> run the canonical generator/runner
    -> read back generated text + receipt
    -> generate a companion CI-voodoo image when native image generation is available
    -> optionally prepare publication-ready X copy

Publishing itself remains a separate authorized action. The generator/runner and image generation are execution steps; they do not imply publication authority.

## Explicit mode

Explicit invocation is the normative path and must always work on supported hosts.

Examples:

- invoke CI-voodoo on a real OpenAI/ChatGPT incident such as a lost message, broken renderer, tool failure, flaky CI, permission regression, or routing glitch;
- ask to turn that incident into a curse, complaint, caption, poster copy, or profanity artifact;
- request a canonical/reproducible run;
- request a publication-ready X artifact or CI-voodoo image;
- ask for standalone ritual/curse/chant output when no incident context is needed.

For a real OpenAI/ChatGPT incident, do not stop at an improvised chat line when the canonical runner is reachable. Run the generator first, use its generated text as the primary profanity/satire artifact, and generate a companion image when native image generation is available unless the user asks for text only.

For standalone ritual/curse/chant requests with no incident workflow intent, a direct chat artifact is acceptable.

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

For real incident handling, canonical generation is the default execution path when repository execution is reachable. Use the native GitHub integration if it exposes workflow dispatch; otherwise use MarcoPolo to operate the repository and dispatch the existing GitHub Actions runner. Do not invent a new MCP facade for this path.

Repository: `TeaShaman-cyber/ci-voodoo-research`
Workflow: `.github/workflows/canonical-ritual.yml` (`CI Voodoo`)
Trigger: `workflow_dispatch`
Artifact: `ci-voodoo-canonical`

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

Execution procedure:

1. Classify the incident into the existing target taxonomy and choose intensity/style.
2. Compute an opaque `incident_ref` as a SHA-256 reference without placing raw chat/incident text in public workflow inputs.
3. Dispatch `canonical-ritual.yml` through the native GitHub integration when that integration exposes workflow dispatch.
4. Otherwise, use MarcoPolo and the repository's authenticated GitHub CLI/API route to dispatch `workflow_dispatch` with the bounded inputs above.
5. Observe the workflow to terminal state.
6. Read back the `ci-voodoo-canonical` artifact and use `result.json` as the generated text plus `receipt.json` as canonical evidence.
7. If execution cannot be completed or verified, report the canonical path as unavailable/degraded and only then fall back to a clearly labeled non-canonical chat artifact.

### image

Image generation is outside canonical runner v1 and uses the host's native image generation capability. For a real incident, after the runner returns generated text, generate a companion CI-voodoo image when native image generation is available unless the user asks for text only.

Build the image brief from the same incident classification and generated artifact. It should contain:

- subject;
- ritual motif;
- engineering target;
- text/caption if any;
- composition;
- mood;
- exclusions.

If native image generation is unavailable, return the image brief/prompt and say that rendering was not available in the current host.

## Runner route

The canonical runner already exists in GitHub Actions. It does not require a plugin-local MCP facade.

Use the thinnest available route:

    native GitHub integration with workflow dispatch
    -> otherwise MarcoPolo + authenticated GitHub workflow dispatch

GitHub Actions is the canonical execution backend; MarcoPolo or the native GitHub integration are control-plane routes to it.

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
