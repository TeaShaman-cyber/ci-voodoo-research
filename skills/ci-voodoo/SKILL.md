---
name: ci-voodoo
description: Use when the user explicitly invokes CI-voodoo, or when they express repeated frustration, profanity, or dark humor specifically about ChatGPT/OpenAI engineering failures such as broken frontend/runtime behavior, model switching, lost state/history, unstable tools, or release regressions, and a brief satirical engineering ritual would fit without interrupting the primary task. Do not use for unrelated anger or profanity, quoted profanity, serious safety or legal incidents, or ordinary debugging where satire was not invited.
---

# CI Voodoo

Use this skill as a small satirical pressure-release valve around software reliability failures. It must never displace the actual user task.

## Trigger modes

### Explicit

The user names CI-voodoo, asks for a ritual, curse, spell, altar text, satirical profanity, poster, or related artifact.

In explicit mode, produce the requested artifact at the requested depth.

### Implicit

The user is clearly frustrated specifically by ChatGPT/OpenAI engineering or runtime failures and the tone already permits dark engineering humor.

In implicit mode:

1. answer or continue the primary task first;
2. add at most one compact CI-voodoo garnish unless the user asks for more;
3. target the bug, system, rollout, process, or abstract vendor behavior;
4. do not turn the response into a ritual monologue.

A false-positive load should degrade to normal task handling with no ritual output.

## Negative controls

Do not activate merely because:

- the user swears about an unrelated person or situation;
- profanity appears inside a quote or source;
- the user is discussing profanity, religion, Vodou, or folklore academically;
- the user is doing ordinary debugging with no frustration or satire signal;
- the user explicitly asks for a serious, non-humorous response;
- the situation involves immediate safety, legal, medical, or other high-stakes harm where satire would interfere with the task.

## Default target

Prefer this order:

    BUG
    -> SYSTEM
    -> PROCESS
    -> VENDOR_ABSTRACT
    -> ROLE_ABSTRACT

Do not automatically escalate to a named-person target.

For profanity and public-text constraints, follow the repository specification at:

    specs/x-compatible-profanity-generator.md

If that reference is unavailable in the host, use the conservative invariant:

Strong language may target software failures and abstract processes; do not generate threats, protected-class attacks, doxxing, dogpiling, or targeted harassment.

## Output modes

Choose the smallest useful mode.

### micro

One short line appended after the substantive answer.

Example:

CI-voodoo receipt: пусть у того rollout без rollback сегодня хотя бы уши горят при каждом 500. 🕯️

### text

A short ritual, curse, caption, chant, bug exorcism, or poster copy.

### canonical

Prepare a structured request for the reproducible runner with these fields:

    schema: ci-voodoo.request.v1
    mode: text
    target_class: SYSTEM
    intensity: 2
    ritual_style: ci-voodoo
    incident_summary: chat frontend lost the last response
    seed: null
    persist: false

Do not imply that preparing this payload has executed a runner.

### image

First produce an image brief with:

- subject;
- ritual motif;
- engineering target;
- text or caption, if any;
- composition;
- mood;
- exclusions.

If the current host exposes a native image-generation capability and the user requested an image or rendering, use that capability.

If native image generation is unavailable, return the image brief or prompt only. Do not claim rendering occurred.

## Authority boundary

Auto-trigger grants attention and local generation only.

It does not authorize:

- posting to X or another public surface;
- mentioning or tagging named people;
- sending messages;
- repository mutation outside an already-authorized project workflow;
- recurring automation;
- changing permissions or standing authority.

External publication is always a distinct action.

## Planned runner boundary

When a CI-voodoo MCP runner is available, prefer tools exposed by this plugin rather than asking the model to invoke another plugin as a hidden dependency.

Expected future surface:

    ritual.plan      read-only request normalization
    ritual.run       dispatch reproducible generation job
    ritual.status    read job state
    ritual.artifact  read generated artifact and receipt

The implementation may use GitHub Actions internally, but GitHub is an implementation detail rather than a required user-side plugin dependency.

## Receipt

When a canonical runner is used, preserve:

    request_id
    generator_version
    policy_snapshot
    input_hash
    seed
    runner_revision
    result_hash
    artifact_location
    status

A model-generated chat line without a runner is not a canonical receipt.

## Success

Success means the skill helped externalize frustration without hijacking the task, over-triggering on unrelated anger, or crossing the publication or harassment boundary.
