# Image placement — what the theme now does

Companion to the image placement guide v1.0. That document says where the 64
images go; this one says how the theme puts them there, what it decided where the
guide left a choice, and what is still waiting on you.

---

## 1. The one thing you have to do

**Upload all 64 WebP files to Settings → Files, named exactly as the guide names
them.** Nothing else. There is no image to pick in the theme editor, no
collection image to set, no per-page upload.

Every placement resolves by filename. Until a file is uploaded its slot renders
*nothing* — not a broken image, not a placeholder — so you can upload in any
order and watch the site fill in.

To get from the PNG set to uploadable WebP:

```bash
pip install Pillow
python3 scripts/prepare-images.py "E:\client\Restaurant supply\images" ./webp
```

That does the whole of guide section 1: WebP at quality 85, sRGB with other
profiles converted then stripped, EXIF removed, longest edge from the section 4
table, and the exact filename with `-v2-final-FINAL` style suffixes taken off. It
refuses to guess: anything it cannot match it lists as missing, and anything with
the wrong shape or too few pixels it flags rather than quietly fixing.

It does not crop. The 21:9 files that render at 3:1 are cropped from the centre
at render time, so cropping them here would crop them twice.

It cannot check what is *in* a picture. Guide section 7 — invented lettering on
box flaps, fingers, the empty thirds, brand marks on glove boxes — is still by eye.

---

## 2. How it works

Three files carry the whole system.

| File | Job |
|---|---|
| `snippets/rsh-image-library.liquid` | One row per image: alt text, render aspect, upload width. The only place the set is described. |
| `snippets/rsh-image.liquid` | Draws one image: srcset at 750/1100/1500/2000/3000 capped to the file, explicit `width` and `height`, centre crop, alt from the library. Renders nothing if the file is absent. |
| `scripts/prepare-images.py` | Converts and names the set before upload. |

Because alt text lives in one place, fixing a description fixes it everywhere the
picture appears. Because every `<img>` carries real dimensions, the nine-image
home page reserves its layout before the files arrive, which is the layout shift
guide section 7.8 asks you to check for.

---

## 3. Where each image renders

### Home page

| # | Section | Image |
|---|---|---|
| 2 | Hero | `hero-warehouse-dock`, swapping to `hero-warehouse-dock-mobile` under 750px |
| 3 | Trust strip | none — flat Paper `#FCFCFB`, see 5.1 |
| 5 | Category grid | the six `col-*` |
| 6 | The number that actually matters | the live price block, with `per-piece-hand-bowl` beside it |
| 7 | The more you stock | `volume-tier-stacks`, ladder beside it |
| 8 | Start here | `start-here-mixed-cases` behind the heading, as a band |
| 9 | Shop by business | the six `persona-*` |
| 10 | Sourcing | `sourcing-factory-floor` |
| 11 | Reorder | `reorder-clipboard-cases` |
| 12 | Testimonials | none, deliberately |
| 13 | Closing CTA | `cta-order-staged-dock` |
| 14 | Samples CTA | `samples-three-case` |

### Collections

Driven entirely by the collection handle by `sections/rsh-collection-banner.liquid`.

| Handles | Image | Title |
|---|---|---|
| the 5 parents + `compostable` | `col-<handle>` | over the empty left third, left aligned |
| the 28 sub-collections | `sub-<handle>` | above the picture |
| the 6 business collections | `persona-<type>` | above the picture |
| `best-sellers` | `start-here-mixed-cases` | above the picture |
| `new-arrivals` | none at launch | — |

The banner also renders the collection description under it, so the order on the
page is banner, then words, then products.

### Pages

`sections/rsh-page-header.liquid`, by page handle: `wholesale`, `about`,
`shipping`, `returns`, `faq`, `rewards`, `referral`, `contact`. Plus
`page-field-notes` on the blog index and `404-empty-shelf` on the 404.

`samples-three-case` sits inline above the sample request form rather than as a
band, because a buyer on that page is there to fill the form in.

### Global

`og-share` is the sitewide Open Graph and Twitter card fallback; products and
collections keep their own image. `blog-default` covers any post with no featured
image of its own, on both the post and its card in the index.

---

## 4. Decisions the guide left open

1. **The per-piece section shows the live price block, not a screenshot.** Guide
   3.5 wants a screenshot so the numbers can be checked. The section renders the
   real price block from a real product instead, which is strictly better: the
   numbers cannot drift from the catalogue because they *are* the catalogue. The
   screenshot setting is still there if you want a still.

2. **Category tiles crop the `col-*` files to 16:9.** They are 21:9 built around
   an empty left third for an overlaid title, and a tile puts its title
   underneath. 16:9 is as tight as they crop before the cases start going.

3. **Business collection banners render at 16:9, not 3:1.** The persona files are
   4:3. Cropping a 4:3 to a 3:1 band throws away more than half its height.

4. **Page bands sit above the page's headline, not under it.** Guide 2.4 says
   under the title, but each page's headline is editorial copy inside the page
   body ("Two people, 17 years, one stubborn idea"), not the Shopify page title.
   Rendering the Shopify title instead would replace a good headline with the word
   "About". Move the band by dragging the section in the theme editor if you would
   rather have it below.

5. **The parent banner title has no scrim by default.** There is a checkbox on
   the section that puts a soft gradient behind the title only, never across the
   picture. Turn it on only if you look at a real screen and the title is hard to
   read.

6. **Two things changed that are not images.** The home page ran the testimonials
   before the reorder block; spec 6.1 has them the other way round, so they were
   swapped. The hero had a full-bleed overlay switched on, which guide 3.1
   forbids, so it is off.

---

## 5. Not placed, on purpose

| File | Why |
|---|---|
| `trust-strip-concrete` | Guide 3.4 asks you to build the band flat on Paper `#FCFCFB` first and only reach for the texture if the flat version feels weak. It is flat. Upload the file so the option exists; the theme does not use it. |
| `page-quick-order` | Guide 3.7: the first one to cut. A band in front of a task is decoration. To add it anyway, put a Page header band section on the quick order template. |
| `email-header` | Shopify notification templates live in admin under Settings → Notifications, not in the theme, so no theme change can place it. Paste it under the logo there and set the containing cell's background to `#FCFCFB` so the email still looks intentional with images off, per guide 3.8. |

---

## 6. Alt text that needs your eyes

Guide section 5 writes out alt text for 24 images and gives a pattern for the 28
sub-collections, which the theme follows using the live collection title. The
page header bands only say "describe what is in the picture", and the guide spells
out just `page-returns`.

So these are drafted from the page they sit on, not from the picture. **Open each
file, look at it, and correct the line in `snippets/rsh-image-library.liquid`.**
A confident wrong description is worse for a screen reader than the generic one it
replaced.

`page-wholesale`, `page-about`, `page-faq`, `page-rewards`, `page-referral`,
`page-quick-order`, `page-contact`, `page-field-notes`, `blog-default`.

`page-shipping` is drafted as a departing truck on the strength of guide section
8, which says to regenerate it as a will-call counter if Sunnyvale local pickup
stays. If it does, the alt text changes with the picture.

---

## 7. Still blocked, unchanged

Carried from guide section 8. None of it stops the 64 going up.

- **About page founder portraits.** Guide 3.6 is firm: two real photographs, both
  founders, same day, same way, real names and titles under them. No generated
  portrait, no stock photo. Until they arrive the page ships with no portrait
  rather than a placeholder face, which is what it does now.
- **`page-shipping` subject**, pending the local pickup decision.
- **Compostable collection copy**, pending PFAS documentation.
- **Product images for 65 SKUs**, pending the photo shoot. None of these 64 is a
  product image and none is used as one.

One thing the guide does not cover that you should know: the sourcing block still
carries Horizon's demo copy ("Productivity Essentials", "Objects that partner with
your digital tools"). The picture is now right; the words are not. They were left
alone because the honest version needs real sourcing facts, and this build's
standing rule is that a bracketed gap beats a plausible invention.

---

## 8. A note on theme updates

Everything custom is `rsh-` prefixed so a Horizon update cannot overwrite it, with
two exceptions. `blocks/_blog-post-image.liquid` and
`blocks/_blog-post-featured-image.liquid` are stock Horizon blocks, edited to fall
back to `blog-default`. A Horizon update will revert them. The change is four
lines in each; re-apply or drop it, nothing else depends on it.
