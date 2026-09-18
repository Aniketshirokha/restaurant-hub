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

# --------------------------------------------------------------------------
# Template blocks against their schemas.
#
# Shopify rejects a whole JSON template, silently, when any block in it carries
# a value its schema cannot take: a select value that is not one of the options,
# a range value off the step or out of bounds, a checkbox that is not a boolean.
# The file simply never syncs while its neighbours do. This walks every template
# and section group, finds each block's schema, and checks each setting given.
# --------------------------------------------------------------------------
import glob as _glob


def _schema_of(path):
    try:
        text = open(path).read()
    except OSError:
        return None
    m = re.search(r'{%-?\s*schema\s*-?%}(.*?){%-?\s*endschema\s*-?%}', text, re.S)
    if not m:
        return None
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError:
        return None


def _settings_index(schema):
    return {s['id']: s for s in schema.get('settings', []) if s.get('id')}


def _check_settings(where, given, schema, problems):
    index = _settings_index(schema)
    for key, value in given.items():
        s = index.get(key)
        if s is None:
            continue  # unknown keys are tolerated by Shopify; only bad values reject
        kind = s.get('type')
        if kind == 'select':
            # Shopify accepts a select value it does not know (cart.json carries
            # one today and syncs), so this is a warning, not a rejection.
            options = [o['value'] for o in s.get('options', [])]
            if value not in options:
                print(f'  warning: {where}: {key} = {value!r} is not one of {options}')
        elif kind == 'range':
            if not isinstance(value, (int, float)) or isinstance(value, bool):
                problems.append(f'{where}: {key} = {value!r} but the setting is a range (number)')
            else:
                lo, hi, step = s.get('min', 0), s.get('max', 100), s.get('step', 1)
                if value < lo or value > hi:
                    problems.append(f'{where}: {key} = {value} is outside {lo}..{hi}')
                elif step and abs(((value - lo) / step) - round((value - lo) / step)) > 1e-9:
                    problems.append(f'{where}: {key} = {value} is not on a step of {step} from {lo}')
        elif kind == 'checkbox' and not isinstance(value, bool):
            problems.append(f'{where}: {key} = {value!r} but the setting is a checkbox (true/false)')


def _walk_blocks(where, blocks, problems):
    for bid, block in (blocks or {}).items():
        btype = block.get('type', '')
        schema = _schema_of(f'blocks/{btype}.liquid')
        if schema is not None:
            _check_settings(f'{where} > {bid} [{btype}]', block.get('settings', {}), schema, problems)
        _walk_blocks(f'{where} > {bid}', block.get('blocks'), problems)


# Dynamic sources ("{{ closest.product.title }}" and the like) are validated
# against an allowlist Shopify does not publish. A template that uses one
# outside it is rejected whole, and the GitHub sync says nothing: that is how
# templates/product.json sat unchanged through four pushes over
# `closest.product.type`. Every source the theme's own schemas use has been
# accepted by Shopify, so those are safe; anything else has to be proven first
# (an upsert to an unpublished theme returns the real error) and then added here.
_DYNAMIC = re.compile(r'{{\s*(closest\.[a-z_]+(?:\.[a-z_]+)*)\s*}}')
PROVEN_DYNAMIC_SOURCES = {
    'closest.product',
    'closest.product.title',
    'closest.product.description',
    'closest.page.title',  # templates/page.contact.json synced with these two
    'closest.page.content',
}


def _known_dynamic_sources():
    known = set(PROVEN_DYNAMIC_SOURCES)
    for path in _glob.glob('sections/*.liquid') + _glob.glob('blocks/*.liquid'):
        if path.split('/')[-1].startswith('rsh-'):
            continue  # ours are not evidence of anything
        schema = _schema_of(path)
        if schema is not None:
            known.update(_DYNAMIC.findall(json.dumps(schema)))
    return known


def _check_dynamic_sources(path, raw, known, problems):
    for src in sorted(set(_DYNAMIC.findall(raw))):
        if src not in known:
            problems.append(
                f"{path}: dynamic source '{src}' is not one Shopify has accepted for this theme; "
                f"it rejects the whole template over it without a word. Prove it against an "
                f"unpublished theme first, then add it to PROVEN_DYNAMIC_SOURCES"
            )

def check_templates_against_schemas():
    problems = []
    known_sources = _known_dynamic_sources()
    for path in sorted(_glob.glob('templates/*.json') + _glob.glob('sections/*.json')):
        raw = re.sub(r'/\*.*?\*/', '', open(path).read(), flags=re.S)
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            continue  # reported by the JSON check already
        _check_dynamic_sources(path, raw, known_sources, problems)
        for sid, section in data.get('sections', {}).items():
            stype = section.get('type', '')
            schema = _schema_of(f'sections/{stype}.liquid')
            where = f'{path} > {sid} [{stype}]'
            if schema is not None:
                _check_settings(where, section.get('settings', {}), schema, problems)
            _walk_blocks(where, section.get('blocks'), problems)
    return problems



_template_problems = check_templates_against_schemas()
for _line in _template_problems:
    print(_line)
problems.extend(_template_problems)

print(f'\n{len(problems)} problem(s)')
sys.exit(1 if problems else 0)
