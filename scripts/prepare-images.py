#!/usr/bin/env python3
"""
Turn the generated PNG set into the 64 WebP files the theme expects.

Section 1 of the image placement guide asks for WebP at quality 85, sRGB with
every other profile stripped, no EXIF, a longest edge from the section 4 table,
and the exact filename with no version suffix. This does all of that, refuses to
guess when a file is ambiguous, and tells you what is missing.

It never crops. The 3:1 parent banners and page bands are 21:9 files cropped from
the centre at render time by the theme, so cropping here would crop them twice.
The one exception is og-share, which the guide pins to 1200x675 exactly.

    python3 scripts/prepare-images.py "E:\\client\\Restaurant supply\\images" ./webp

Then upload everything in the output folder to Settings, Files in Shopify admin.

Needs Pillow:  pip install Pillow
"""

import argparse
import pathlib
import re
import sys

try:
    from PIL import Image, ImageCms
except ImportError:
    sys.exit("Pillow is not installed. Run:  pip install Pillow")

QUALITY = 85

# name -> (longest edge, source aspect width, source aspect height, exact size?)
#
# The aspect here is the shape of the FILE, which is not always the shape the
# theme renders it at. The parent banners and the page bands are 21:9 files shown
# at 3:1; the theme does that crop, not this script.
SPEC = {}


def add(names, edge, aw, ah, exact=False):
    for n in names:
        SPEC[n] = (edge, aw, ah, exact)


add(['hero-warehouse-dock'], 3000, 21, 9)
add(['hero-warehouse-dock-mobile'], 1600, 4, 5)
add(['og-share'], 1200, 16, 9, True)
add(['cta-order-staged-dock', 'start-here-mixed-cases', 'trust-strip-concrete'], 2400, 21, 9)
add(['samples-three-case'], 1200, 1, 1)
add(['email-header'], 1200, 21, 9)
add(['per-piece-hand-bowl'], 1600, 4, 3)
add(['404-empty-shelf', 'volume-tier-stacks', 'sourcing-factory-floor',
     'reorder-clipboard-cases'], 1600, 16, 9)
add(['persona-cloud-kitchen', 'persona-caterer', 'persona-food-truck',
     'persona-cafe', 'persona-deli', 'persona-full-service'], 1600, 4, 3)
add(['col-food-packaging', 'col-food-service', 'col-disposable-gloves',
     'col-paper-products', 'col-janitorial-cleaning', 'col-compostable'], 2400, 21, 9)
add(['page-wholesale', 'page-about', 'page-shipping', 'page-returns', 'page-faq',
     'page-rewards', 'page-referral', 'page-quick-order', 'page-contact',
     'page-field-notes'], 2400, 21, 9)
add(['blog-default'], 2000, 16, 9)
add(['sub-' + h for h in (
    'take-out-containers microwaveable-containers deli-soup-containers '
    'hinged-clamshells paper-food-containers-pails aluminum-pans-foil-lids '
    'carry-out-bags food-wrap-deli-paper stretch-pallet-wrap hot-cups-lids '
    'cold-cups-lids portion-cups-lids cup-carriers-accessories cutlery '
    'plates-bowls straws food-deli-trays nitrile-gloves vinyl-gloves '
    'latex-gloves poly-pe-tpe-gloves industrial-gloves paper-towels napkins '
    'bath-tissue toilet-seat-covers cleaning-chemicals trash-bags-can-liners'
).split()], 2000, 16, 9)

assert len(SPEC) == 64, len(SPEC)

SRGB = ImageCms.createProfile('sRGB')


def normalise(stem):
    """Strip the version suffixes the guide bans, so v2-final-FINAL still matches."""
    s = stem.lower().replace('_', '-').replace(' ', '-')
    s = re.sub(r'-(v\d+|final|copy|edit|new|out|export)\b', '', s)
    return re.sub(r'-+', '-', s).strip('-')


def to_srgb(im):
    """Convert through any embedded profile, then drop it. A P3 file renders
    oversaturated in Chrome on Windows, which is the whole point of this step."""
    icc = im.info.get('icc_profile')
    if icc:
        try:
            import io
            src = ImageCms.ImageCmsProfile(io.BytesIO(icc))
            im = ImageCms.profileToProfile(im, src, SRGB, outputMode='RGB')
        except Exception:
            im = im.convert('RGB')
    return im.convert('RGB') if im.mode != 'RGB' else im


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('source')
    ap.add_argument('output')
    ap.add_argument('--quality', type=int, default=QUALITY)
    args = ap.parse_args()

    src_dir = pathlib.Path(args.source)
    out_dir = pathlib.Path(args.output)
    if not src_dir.is_dir():
        sys.exit('No such folder: %s' % src_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    found, extras = {}, []
    for p in sorted(src_dir.iterdir()):
        if p.suffix.lower() not in {'.png', '.jpg', '.jpeg', '.webp', '.tif', '.tiff'}:
            continue
        key = normalise(p.stem)
        if key in SPEC:
            found.setdefault(key, []).append(p)
        else:
            extras.append(p.name)

    written, warnings = [], []
    for key, paths in sorted(found.items()):
        if len(paths) > 1:
            warnings.append('%s: %d files match, using %s'
                            % (key, len(paths), paths[0].name))
        path = paths[0]
        edge, aw, ah, exact = SPEC[key]

        with Image.open(path) as im:
            im = to_srgb(im)
            w, h = im.size
            got, want = w / h, aw / ah
            if abs(got - want) / want > 0.04:
                warnings.append('%s: shape is %.2f:1, the guide expects %d:%d (%.2f:1)'
                                % (key, got, aw, ah, want))

            if exact:
                target = (edge, round(edge * ah / aw))
                if (w, h) != target:
                    warnings.append('%s: resized to exactly %dx%d' % (key, *target))
                im = im.resize(target, Image.LANCZOS)
            else:
                if max(w, h) < edge:
                    warnings.append('%s: source is %dpx on its longest edge, the guide '
                                    'wants %dpx. Upscaled, so it will look soft.'
                                    % (key, max(w, h), edge))
                scale = edge / max(w, h)
                im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))),
                               Image.LANCZOS)

            dest = out_dir / (key + '.webp')
            # No icc_profile and no exif argument: both are left off deliberately.
            im.save(dest, 'WEBP', quality=args.quality, method=6)
            written.append((key, im.size, dest.stat().st_size))

    missing = sorted(set(SPEC) - set(found))

    print('Wrote %d of 64 to %s' % (len(written), out_dir))
    if warnings:
        print('\nWorth a look (%d):' % len(warnings))
        for w in warnings:
            print('  -', w)
    if missing:
        print('\nMissing (%d):' % len(missing))
        for m in missing:
            print('  -', m + '.webp')
    if extras:
        print('\nNot in the library, skipped (%d):' % len(extras))
        for e in extras[:20]:
            print('  -', e)
        if len(extras) > 20:
            print('  ... and %d more' % (len(extras) - 20))
    if written:
        total = sum(s for _, _, s in written)
        print('\nTotal %.1f MB, average %.0f KB'
              % (total / 1e6, total / len(written) / 1e3))
    print('\nNothing here checks what is IN the picture. Section 7 of the guide '
          '(invented lettering, fingers, empty thirds, brand marks) is still by eye.')


if __name__ == '__main__':
    main()
