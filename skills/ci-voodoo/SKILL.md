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

For real incident handling, canonical generation is the default when an authorized, verified execution route is actually available. Select by current tool capabilities, not a remembered plugin list or a hard-coded MarcoPolo fallback. GitHub repository/Actions read access is not workflow dispatch. Do not invent a new MCP facade or claim that the future service considered in issue #15 is deployed.

Repository: `TeaShaman-cyber/ci-voodoo-research`
Workflow: `.github/workflows/canonical-ritual.yml` (`CI Voodoo`)
Native GitHub inbox: `TeaShaman-cyber/ci-voodoo-research#18`
Triggers: owner-only `issue_comment` ingress or existing `workflow_dispatch`
Artifacts: `ci-voodoo-canonical-<comment_id>` for native GitHub ingress, `ci-voodoo-canonical` for workflow dispatch

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

The exact canonical request schema is bundled with the skill at:

    references/ci-voodoo.request.v1.schema.json

Before any GitHub comment write, construct the complete request first and preflight it against that bundled schema. The preflight is fail-closed:

- allowed keys must be exactly the canonical request fields; no unknown fields;
- `schema` must be exactly `ci-voodoo.request.v1`;
- `mode` must be exactly `text`;
- `target_class` must be one of `BUG`, `SYSTEM`, `PROCESS`, `VENDOR_ABSTRACT`, `ROLE_ABSTRACT`;
- `intensity` must be an integer from 0 through 3;
- `ritual_style` must be one of `plain-rage`, `folk-curse`, `ci-voodoo`, `cato`;
- `incident_ref` must match `^sha256:[0-9a-fA-F]{16,64}---
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

For real incident handling, canonical generation is the default when an authorized, verified execution route is actually available. Select by current tool capabilities, not a remembered plugin list or a hard-coded MarcoPolo fallback. GitHub repository/Actions read access is not workflow dispatch. Do not invent a new MCP facade or claim that the future service considered in issue #15 is deployed.

Repository: `TeaShaman-cyber/ci-voodoo-research`
Workflow: `.github/workflows/canonical-ritual.yml` (`CI Voodoo`)
Native GitHub inbox: `TeaShaman-cyber/ci-voodoo-research#18`
Triggers: owner-only `issue_comment` ingress or existing `workflow_dispatch`
Artifacts: `ci-voodoo-canonical-<comment_id>` for native GitHub ingress, `ci-voodoo-canonical` for workflow dispatch

Canonical requests use:

    schema: ci-voodoo.request.v1
    mode: text
    target_class: SYSTEM
    intensity: 0..3
    ritual_style: ci-voodoo
    incident_ref: sha256:<opaque digest>
    seed: nullable
    persist: false

;
- `seed` must be null or a non-empty string;
- `persist` must be exactly `false`.

If any field fails this preflight, do not write the comment. Correct the request locally and re-run the full preflight before any external write. Runner-side validation remains mandatory defense in depth; this preflight exists to avoid creating malformed public ingress comments in the first place.

### Native ChatGPT GitHub capability map (normative)

Route by **tool contract**, not by tool name. On the current ChatGPT GitHub connector, the following capabilities form a complete native canonical route:

| Required capability | ChatGPT GitHub mapping |
|---|---|
| issue-comment dispatch | `mcp__GitHub__add_comment_to_issue` |
| Actions workflow-run listing/readback | generic `mcp__GitHub__fetch` against approved GitHub Actions run/list URLs |
| run-artifact listing | `mcp__GitHub__fetch_workflow_run_artifacts` |
| artifact download | `mcp__GitHub__download_workflow_artifact` |

The generic `fetch` action **counts as Actions readback when its live contract says workflow runs and their subresources are supported**. Do not infer capability from whether a tool name contains words such as `workflow`, `run`, or `actions`.

If all four capabilities above are exposed and authorized, the native route is sufficient:

    native GitHub comment #18
    -> capture comment_id
    -> GitHub fetch of issue_comment workflow runs
    -> exact artifact ci-voodoo-canonical-<comment_id>
    -> result.json + receipt.json

When that condition holds, **MUST use the native issue-comment ingress and MUST NOT probe exe.dev, Fly Sprites, or MarcoPolo for dispatch**.

Correlate by the exact artifact name containing the returned `comment_id`; do not select a run merely because it is the newest. If needed, enumerate plausible `issue_comment` runs with `fetch` and inspect their artifacts until the exact `ci-voodoo-canonical-<comment_id>` artifact is found.

Fallback is allowed only after a required native capability is concretely observed as one of:

    MISSING
    UNSUPPORTED
    AUTH_DENIED
    TRANSPORT_FAILED

A remembered limitation, a guessed connector gap, or failure to find a suitably named tool is not fallback evidence.

Once any route has produced an observable dispatch for an incident, **STOP route selection**. Never dispatch the same incident through a second route unless the first write is proven not to have occurred. Reconcile ambiguous comment/dispatch state before any retry.

Execution procedure:

1. Classify the incident into the existing target taxonomy and choose intensity/style.
2. Compute an opaque `incident_ref` as a SHA-256 reference without placing raw chat/incident text in public workflow inputs or logs.
3. Apply the normative native capability map above. If all four required GitHub capabilities are present and authorized, use the bounded native ingress and do not probe shell fallbacks:
   - add exactly one comment to issue #18 with first line `/ci-voodoo` and the complete `ci-voodoo.request.v1` JSON on the following line;
   - include only the existing schema fields; `persist` must be `false`;
   - capture the returned GitHub comment ID;
   - do not retry an ambiguous comment write until the issue is read back;
   - enumerate/read `issue_comment` Actions runs using the generic GitHub `fetch` capability;
   - correlate only by exact artifact `ci-voodoo-canonical-<comment_id>`, not by newest-run heuristics;
   - read back matching `result.json` and `receipt.json` before reporting canonical success.
4. If native GitHub lacks one of the four required capabilities for a concrete observed reason (`MISSING`, `UNSUPPORTED`, `AUTH_DENIED`, or `TRANSPORT_FAILED`) but directly exposes authorized `workflow_dispatch`, the existing manual workflow remains a valid native route.
5. Only after such observed native insufficiency choose the current governed shell: prefer exe.dev when its live `list_vms` establishes an authorized running target. Apply the installed `exe-dev-core-router` and current `TeaShaman-cyber/theseus-cloud-shell/RULES.md`; verify authenticated `gh` access to this repository. Run the existing workflow through `gh workflow run canonical-ritual.yml --repo TeaShaman-cyber/ci-voodoo-research --ref main` with only the bounded workflow inputs: `mode`, `target_class`, `intensity`, `ritual_style`, `incident_ref`, optional `seed`. `persist: false` is an authority invariant, not a workflow input.
6. If exe.dev is unavailable or insufficient, consider Fly Sprites and then MarcoPolo only after observed insufficiency, with their current router/rules and independent GitHub authorization checks. Each fallback is a new capability probe, never inherited execution authority. Do not loop through failed routes.
7. Observe the exact workflow run to terminal success. Read back the exact canonical artifact via native GitHub Actions tools or authenticated `gh run download`; require matching `result.json` and `receipt.json` evidence before reporting canonical success.
8. If dispatch or comment creation is ambiguous, inspect current issue comments/runs/artifacts before any retry. A connector, host approval, or shell failure is not proof of generator failure. Report `BLOCKED`, `DEGRADED`, `REPROBE_REQUIRED` or `UNKNOWN` as appropriate.
9. Only when canonical execution/readback cannot be verified, provide an explicitly labeled non-canonical chat artifact rather than pretending to have a runner receipt.

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

The canonical executor is the existing GitHub Actions workflow. No plugin-local MCP facade or stable Fly App endpoint is implemented in this skill.

Choose the thinnest **currently exposed, authorized, and verified** dispatch route:

    native GitHub issue-comment ingress (#18) + fetch-based Actions run readback + exact comment-correlated artifact
    -> native GitHub workflow_dispatch (only if the four-capability issue-comment route is concretely insufficient)
    -> preferred governed exe.dev shell + authenticated gh workflow dispatch
    -> only after observed insufficiency: Fly Sprites
    -> only after observed insufficiency: MarcoPolo
    -> otherwise non-canonical text, explicitly labeled

The native GitHub ingress exists specifically for hosts whose GitHub connector can create/read issue comments and inspect Actions artifacts but does not expose workflow dispatch. The public comment is only a bounded request envelope with an opaque incident hash; never place raw incident/chat text or secrets there. Generated text is not written back to the issue. Capability, authenticated access, permission, successful comment creation, workflow completion, and artifact readback are separate facts.

Tracking: `TeaShaman-cyber/ci-voodoo-research#15`; native invocation inbox: `#18`.

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
