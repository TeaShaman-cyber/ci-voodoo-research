#!/usr/bin/env python3
import argparse
import pathlib
import zipfile

FILES = (
    'plugin.json',
    'skills/ci-voodoo/SKILL.md',
    'skills/ci-voodoo/references/x-compatible-profanity-generator.md',
)
ZIP_TIME = (1980, 1, 1, 0, 0, 0)


def build(root: pathlib.Path, output: pathlib.Path) -> pathlib.Path:
    root = pathlib.Path(root).resolve()
    output = pathlib.Path(output).resolve()
    output.parent.mkdir(parents=True, exist_ok=True)

    missing = [rel for rel in FILES if not (root / rel).is_file()]
    if missing:
        raise FileNotFoundError('missing plugin files: ' + ', '.join(missing))

    with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for rel in sorted(FILES):
            info = zipfile.ZipInfo(rel, ZIP_TIME)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            zf.writestr(info, (root / rel).read_bytes(), compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
    return output


def main() -> None:
    parser = argparse.ArgumentParser(description='Build deterministic CI-voodoo portable plugin ZIP')
    parser.add_argument('output', type=pathlib.Path)
    parser.add_argument('--root', type=pathlib.Path, default=pathlib.Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    path = build(args.root, args.output)
    print(path)


if __name__ == '__main__':
    main()
