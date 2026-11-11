# Private plugin release/update workflow

Issue: #22

Status: VERIFIED OPERATOR PROCEDURE

This document covers the **installed ChatGPT private-plugin release** for CI-voodoo. It does not replace the repository release process or repository CI.

## State model

Keep these domains separate:

    Git repository main
    != portable plugin archive
    != installed private-plugin release
    != already-open chat skill cache

A merged repository change does not automatically update the installed ChatGPT plugin.

Likewise, a successful installed release does not guarantee that an already-open conversation will reload the new skill text immediately.

## Preferred route

Use Plugin Creator as the installation/update authority for the existing private plugin identity.

Do not uninstall/recreate the plugin merely to publish a new version. Do not switch identities when the current plugin is editable.

High-level flow:

    verified repository main
    -> build or prepare plugin overlay/archive
    -> resolve exact installed plugin_id + current_release_id
    -> guarded update_plugin(expected_release_id=...)
    -> read back metadata + manifests + skill source
    -> distinguish release success from session cache state

## Procedure

### 1. Verify repository state first

Before touching the installed plugin:

- merge the intended source change;
- verify repository CI/checks;
- verify the intended semantic version in repository manifests;
- confirm the package content or overlay is derived from that merged state.

Do not use the installed plugin as the source of truth for unmerged code.

### 2. Resolve the exact installed plugin

Use Plugin Creator owned-plugin discovery and record:

- exact `plugin_id`;
- current semantic version;
- exact `current_release_id`;
- scope/discoverability.

For CI-voodoo, preserve the existing plugin identity. A release update is not a migration.

### 3. Inspect current package shape

Use Plugin Creator file inspection before updating.

At minimum, inspect:

- `plugin.json`;
- `.codex-plugin/plugin.json` when present;
- `skills/ci-voodoo/SKILL.md`;
- bundled references that must remain intact.

Do not assume the repository root and installed package have identical file layouts.

### 4. Build the update payload

Prefer the repository's package builder for a full portable archive when practical.

A minimal overlay archive is also valid when Plugin Creator overlay semantics are appropriate:

- include the updated manifest;
- include every changed packaged file;
- include the V2/Codex manifest when the installed package contains one;
- omit unchanged files intentionally so Plugin Creator preserves them;
- do not list omitted files in `delete_paths`.

For a semantic version bump, keep all installed manifests on the same version.

### 5. Guard the mutation

Call Plugin Creator `update_plugin` using:

- the exact existing `plugin_id`;
- the update archive;
- the exact previously-read `expected_release_id`.

This is an optimistic-concurrency guard. If the release ID has changed, stop and reconcile rather than overwriting a newer release.

### 6. Verify the new release

After success, independently read back:

- plugin metadata;
- new `current_release_id`;
- root manifest version;
- V2/Codex manifest version when present;
- the updated skill source and any critical routing/authority invariants.

Do not report a successful update from the mutation response alone.

### 7. Treat chat-local skill cache separately

An already-open chat may continue returning the older skill body through its installed-skill cache even after Plugin Creator source readback proves the new release is current.

Therefore:

    Plugin Creator source release = installed-release authority
    already-open chat skills__read = session-local cache observation

A stale chat cache is not evidence that the guarded release failed.

Re-check in a fresh context when validating host reload behavior.

## What not to do

Avoid detours when the direct Plugin Creator route is available:

- do not use exe.dev, Drive, Sprites, MarcoPolo, or another runtime merely as a file bridge for a small local overlay;
- do not base64-shuttle archives through chat unless no supported file handoff exists;
- do not uninstall/reinstall to force a version refresh;
- do not mutate sharing or permissions as part of an ordinary version update;
- do not bump the semantic version for repository-only operator documentation that is not packaged into the plugin.

## Verified example: 0.1.4 -> 0.1.5

On 2026-11-11 the CI-voodoo private plugin was updated in place:

- existing plugin identity preserved;
- guarded update used the exact current release ID;
- installed version became `0.1.5`;
- root `plugin.json` read back `0.1.5`;
- `.codex-plugin/plugin.json` read back `0.1.5`;
- Plugin Creator source readback contained the deterministic native GitHub router from #19/#21;
- the already-open chat still exposed the previous skill text through its session cache.

That final cache mismatch was classified as host/session caching, not release failure.

## Versioning rule

Use semantic-version bumps for packaged plugin behavior/content changes.

For repository-only operator documentation:

    docs-only change
    -> issue + PR + repository history
    -> no plugin semantic-version bump

This keeps package versions meaningful while preserving full change history.
