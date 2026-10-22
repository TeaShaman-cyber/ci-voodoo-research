# ci-voodoo-research

CI-voodoo is a public personal/open-source experiment in engineering satire: reproducible ritual text for software reliability frustration, with explicit policy and provenance boundaries.

## Current core

- English-first public text generation for X-sized output.
- Explicit invocation is the core path; semantic auto-trigger remains optional/non-blocking.
- Canonical request/result/receipt schemas with deterministic seed replay and byte-verifiable hashes.
- Vendored LibInsult `0.6.2` as the phrase engine, executed in isolated Python 3.11 processes.
- Project-owned CI-voodoo templates and word lists; upstream LibInsult data is not used by the canonical generator.
- GitHub Actions canonical runner with hosted verification.
- Native image generation is a separate optional host capability and is not part of canonical runner v1.

## QA

```sh
./tools/dev/check
```

The gate checks Node contract/runner tests, direct Python adapter tests, vendored source hashes, license provenance, Python runtime version, and whitespace.

## Licensing and provenance

The project is GPLv3. Vendored LibInsult is GPLv3+; vendored `six` is MIT. Exact release/source hashes are recorded in [`THIRD_PARTY.md`](THIRD_PARTY.md).
## Build the portable plugin

```sh
python3 tools/build_plugin.py dist/ci-voodoo-plugin-0.1.0.zip
```

The distributable is intentionally minimal: `plugin.json`, `skills/ci-voodoo/SKILL.md`, and the bundled public-text policy reference. Runtime source, vendored engine code, tests, and repository internals are not included in the skills-only package.
