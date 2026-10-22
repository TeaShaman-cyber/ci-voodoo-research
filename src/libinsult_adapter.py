#!/usr/bin/env python3
import json
import random
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'vendor' / 'six'))
sys.path.insert(0, str(ROOT / 'vendor' / 'libinsult'))

from insult import Insulter  # noqa: E402

ENGINE = 'libinsult'
ENGINE_VERSION = '0.6.2'
DATA_DIR = ROOT / 'data' / 'en-ci'
TEMPLATES = json.loads((DATA_DIR / 'templates.json').read_text(encoding='utf-8'))

SWEAR = {
    0: '',
    1: 'damn ',
    2: 'fucking ',
    3: 'goddamn fucking ',
}


def render(request):
    seed = request['seed']
    if not isinstance(seed, str) or not seed:
        raise ValueError('seed must be a non-empty string')

    style = request['ritual_style']
    target_class = request['target_class']
    intensity = request['intensity']

    try:
        template = TEMPLATES[style][target_class]
    except KeyError as exc:
        raise ValueError('unsupported style/target combination') from exc

    random.seed(seed)
    insulter = Insulter()
    insulter.load_directory(str(DATA_DIR))
    text = insulter.format(template, {'swear': SWEAR[intensity]})

    return {
        'text': text,
        'engine': ENGINE,
        'engine_version': ENGINE_VERSION,
    }


def main():
    request = json.loads(sys.stdin.read())
    result = render(request)
    sys.stdout.write(json.dumps(result, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    main()
