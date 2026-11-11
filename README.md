# ci-voodoo-research

CI-voodoo is a public personal/open-source experiment in engineering satire: reproducible ritual text for software reliability frustration, with explicit policy and provenance boundaries.

## Current core

- English-first public text generation for X-sized output.
- Explicit invocation is the core path; semantic auto-trigger remains optional/non-blocking.
- Canonical request/result/receipt schemas with deterministic seed replay and byte-verifiable hashes.
- Vendored LibInsult `0.6.2` as the phrase engine, executed in isolated Python 3.11 processes.
- Project-owned CI-voodoo templates and word lists; upstream LibInsult data is not used by the canonical generator.
- GitHub Actions canonical runner with hosted verification.
- Native GitHub ingress: owner-only `/ci-voodoo` comments in issue #18 trigger the same canonical runner and produce comment-correlated artifacts for readback.
- Native image generation is a separate optional host capability and is not part of canonical runner v1.

## Native GitHub canonical invocation

When the host GitHub integration can write issue comments and read Actions artifacts, canonical generation does not require `workflow_dispatch` or a shell.

Write one owner-authored comment to [issue #18](https://github.com/TeaShaman-cyber/ci-voodoo-research/issues/18):

```text
/ci-voodoo
{"schema":"ci-voodoo.request.v1","mode":"text","target_class":"SYSTEM","intensity":2,"ritual_style":"ci-voodoo","incident_ref":"sha256:<opaque digest>","seed":null,"persist":false}
```

The workflow rejects non-owner callers, unknown fields, malformed JSON, oversized comments, and any request with `persist != false`. Raw incident/chat text must never be placed in the comment. The generated result is **not** posted back to the public issue; read back the Actions artifact named `ci-voodoo-canonical-<comment_id>` and verify `result.json` plus `receipt.json`.

The existing manual `workflow_dispatch` path remains supported.

## Updating the installed private ChatGPT plugin

Repository releases and the installed ChatGPT private-plugin release are separate state domains. Use the guarded Plugin Creator workflow in [`docs/private-plugin-release.md`](docs/private-plugin-release.md) to update the existing plugin identity after a repository change is merged and verified.

## QA

```sh
./tools/dev/check
```

The gate checks Node contract/runner tests, direct Python adapter tests, vendored source hashes, license provenance, Python runtime version, and whitespace.

## Licensing and provenance

The project is GPLv3. Vendored LibInsult is GPLv3+; vendored `six` is MIT. Exact release/source hashes are recorded in [`THIRD_PARTY.md`](THIRD_PARTY.md).
## Build the portable plugin

```sh
python3 tools/build_plugin.py dist/ci-voodoo-plugin-0.1.5.zip
```

The distributable is intentionally minimal: `plugin.json`, `skills/ci-voodoo/SKILL.md`, and the bundled public-text policy reference. Runtime source, vendored engine code, tests, and repository internals are not included in the skills-only package.
