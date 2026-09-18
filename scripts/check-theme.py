#!/usr/bin/env python3
"""
The checks that have actually caught something on this theme.

Shopify's GitHub sync rejects a bad file silently: it simply does not change,
while everything else in the same commit lands. That makes these failures
expensive to spot by eye, so they are checked here instead.

    python3 scripts/check-theme.py

Exits non-zero when anything is wrong.
"""

import glob
import json
import re
import sys

problems = []


def schemas():
    for path in sorted(glob.glob('sections/*.liquid') + glob.glob('blocks/*.liquid')):
        src = open(path).read()
        match = re.search(r'\{%\s*schema\s*%\}(.*?)\{%\s*endschema\s*%\}', src, re.S)
        if not match:
            continue
        try:
            yield path, json.loads(match.group(1))
        except Exception as exc:
            problems.append(f'{path}: schema is not valid JSON: {exc}')


def check_settings(path, settings, where):
    ids = [s.get('id') for s in settings or [] if s.get('id')]
    for dupe in sorted({i for i in ids if ids.count(i) > 1}):
        problems.append(f'{path} [{where}]: duplicate setting id "{dupe}"')

    for s in settings or []:
        if s.get('type') != 'range':
            continue
        lo, hi, step, default = s.get('min'), s.get('max'), s.get('step'), s.get('default')
        if None in (lo, hi, step) or default is None:
            continue
        # A range default has to be reachable from min in whole steps, or
        # Shopify refuses the file.
        steps = (default - lo) / step
        if abs(steps - round(steps)) > 1e-9:
            problems.append(
                f'{path} [{where}]: range "{s["id"]}" default {default} is not on '
                f'the {step} step from {lo}')
        if not lo <= default <= hi:
            problems.append(
                f'{path} [{where}]: range "{s["id"]}" default {default} is outside {lo}..{hi}')


for path, schema in schemas():
    check_settings(path, schema.get('settings'), 'section')
    for block in schema.get('blocks') or []:
        check_settings(path, block.get('settings'), 'block:' + str(block.get('type')))

# Inside a {% liquid %} tag each line is its own tag, so a filter chain wrapped
# onto the next line parses as a tag named "|".
for path in sorted(glob.glob('sections/*.liquid') + glob.glob('blocks/*.liquid')
                   + glob.glob('snippets/*.liquid')):
    src = open(path).read()
    for match in re.finditer(r'\{%-?\s*liquid\b(.*?)-?%\}', src, re.S):
        for line in match.group(1).split('\n'):
            if line.strip().startswith('|'):
                problems.append(f'{path}: filter continuation inside a liquid tag: {line.strip()[:50]}')

for path in sorted(glob.glob('templates/*.json') + glob.glob('sections/*.json')
                   + glob.glob('config/*.json')):
    try:
        json.loads(re.sub(r'/\*.*?\*/', '', open(path).read(), flags=re.S))
    except Exception as exc:
        problems.append(f'{path}: not valid JSON: {exc}')

css = open('assets/rsh.css').read()
if css.count('{') != css.count('}'):
    problems.append('assets/rsh.css: unbalanced braces')

for problem in problems:
    print(problem)
print(f'\n{len(problems)} problem(s)')
sys.exit(1 if problems else 0)
