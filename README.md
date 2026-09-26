# Restaurant Supply Hub — Shopify theme

Horizon-based theme (Tinker 4.1.4) built to the site specification in
`restaurantsupplyhubsitespec.md`.

Everything custom is prefixed `rsh-` so a Horizon update never overwrites it. The
stock sections are used wherever one already does the job; the `rsh-` files exist
only where the spec asks for something the theme has no equivalent for.

---

## What is custom, and why

The theme already ships volume pricing, but it reads
`variant.quantity_price_breaks`, which is Shopify B2B and therefore Plus-only,
and it renders the ladder inside a popover. The spec's whole position is that the
ladder is visible without asking, on any plan. So the pricing pieces are ours.

### Product page blocks

| Block | What it does |
|---|---|
| **Case and per-piece price** | Case price with the per-piece price beneath it, both re-pricing live with quantity. |
| **Volume tier ladder** | Every tier with the case and per-piece price at each, current tier highlighted, next-tier nudge, annual saving line. |
| **Stock status** | Real case counts. Horizon's own inventory block stops counting above 100 units. |
| **Matching lid or base** | Reads the `lid_sku` product reference. |
| **Product spec table** | Built from metafields, empty rows omitted. |

### Sections

| Section | Used on |
|---|---|
| **Collection banner** | Every collection page |
| **Category grid** | Home |
| **Page header band** | Content pages, blog index, 404 |
| **Samples CTA** | Home, Samples |
| **Trust strip** | Home |
| **Per-piece explainer** | Home |
| **Volume pricing table** | Home, Wholesale |
| **Shop by business** | Home, Shop by business |
| **Customer quotes** | Home, Reviews |
| **Testimonial grid** | Product (three showing, "View more" for the rest; the home page's three illustrative quotes hold the first slots until real ones replace them) |
| **Quick order pad** | Quick order |
| **Wholesale application** | Wholesale application, Quote, Samples |
| **Free shipping progress** | Cart |

### Stock sections reused as-is

`hero`, `collection-list`, `product-list`, `media-with-content`, `section`,
`accordion`, `header-announcements`, `main-product`, `main-collection`,
`main-cart`, `main-page`.

---

## Before this renders correctly

### 1. Product metafields

The per-piece price, the spec table and the lid pairing all read metafields.
Create these under **Settings → Custom data → Products**, namespace `custom`.

**`pieces_per_case` is the one that matters.** Without it the per-piece price
cannot render at all, and the store loses its whole differentiator. Everything
else degrades quietly.

| Key | Type | Example |
|---|---|---|
| `pieces_per_case` | Integer | `450` |
| `item_number` | Single line text | `TFRDB24` |
| `product_dimensions` | Single line text | `6.4 x 3.5 in` |
| `capacity` | Single line text | `24 oz` |
| `case_pack` | Single line text | `120 sets` |
| `ti_hi` | Single line text | `14/4 (56 cs)` |
| `material` | List of single line text, or metaobject list | `PP`, `Bagasse` |
| `compartments` | Integer | `3` |
| `microwave_safe` | True or false | `true` |
| `freezer_safe` | True or false | `true` |
| `compostable` | True or false | `true` |
| `pfas_status` | Single line text | pending supplier docs |
| `lid_sku` | Product reference | links a base to its lid |
| `case_weight_lbs` | Decimal | `12.4` |

Two additions beyond the spec's table, both optional:

| Key | Type | Purpose |
|---|---|---|
| `piece_noun` | Single line text | `bowl`, so the page reads "per bowl" instead of "per piece" |
| `piece_noun_plural` | Single line text | Only needed where adding an `s` is wrong, e.g. `boxes` |

The namespace is configurable in **Theme settings → Case and per-piece pricing**
if you use something other than `custom`.

Keep the internal item code in the variant **SKU** field as well as
`item_number`. The quick order pad matches on SKU, and existing customers reorder
by that code.

### 2. Theme settings

**Theme settings → Case and per-piece pricing** holds the tier ladder, the
per-piece decimal places and the free shipping threshold. Every page reads from
here, so there is only one place to change them.

Shipped defaults, from spec sections 5.2 and 5.3:

| Cases in cart | Discount |
|---|---|
| 1 to 2 | Standard |
| 3 to 5 | 6% |
| 6 to 11 | 11% |
| 12 to 24 | 16% |
| 25 to 49 | 21% |
| 50+ | Quote |

Free shipping over **$149**. Per-piece shown to **three decimals**.

Three decimals is deliberate. At `$0.22` versus `$0.21` you have hidden the
difference a buyer is looking for. At `$0.220` versus `$0.208` they can see it.

### 3. The theme only displays the ladder

**It does not apply the discount.** Configure the matching rules in your pricing
app or in Shopify discounts, counted **cart-wide**, and keep them in step with
the theme settings. If the two disagree, the cart contradicts the product page in
front of the buyer.

Cart-wide counting is the thing that beats WebstaurantStore, which counts per
item. Four cases of containers, three of gloves and five of liners has to reach
the twelve-case price on all of it.

Everything is priced by the case, so one unit of line item quantity is one case.
If single units are ever sold, the case counting in `assets/rsh-pricing.js` needs
revisiting.

### 4. Pages and templates

The pages exist in the store with the matching template assigned, and each one
has its search title and description set under the page's **Search engine
listing** (the `global.title_tag` and `global.description_tag` metafields,
which Shopify feeds into `page_title` and `page_description` for the head).
The section copy lives in the templates. Only `page.contact` renders the page
body, so the contact page's body stays blank; the other pages carry a one- or
two-sentence summary in the body, which the admin list and the storefront's
own search results show.

| Page handle | Template |
|---|---|
| `wholesale` | `page.wholesale` |
| `wholesale-application` | `page.wholesale-application` |
| `request-a-quote` | `page.request-a-quote` |
| `quick-order` | `page.quick-order` |
| `shop-by-business` | `page.shop-by-business` |
| `about-us` | `page.about` |
| `why-us` | `page.why-us` |
| `contact` | `page.contact` |
| `deals` | `page.deals` |
| `shipping` | `page.shipping` |
| `returns` | `page.returns` |
| `faq` | `page.faq` |
| `samples` | `page.samples` |

Three templates ship without a page on purpose. `page.rewards` and
`page.referral` describe a programme that needs a rewards app before the copy
is true, and `page.reviews` is built around a review app's widget. Create
those pages when the app is installed, not before.

### 5. Collections

Build the structure in spec section 3. The five parents are Food Packaging, Food
Service, Disposable Gloves, Paper Products and Janitorial & Cleaning, plus
`compostable` populated by tag rather than by category, and the six
`shop-by-business` collections the cards point at.

Then point the Shop by business cards at those collections in the theme editor.
A card with a collection picked takes its title, image and link from the
collection, so renaming the collection cannot leave the card stale.

Every collection carries a written description and its own search title and
description, editable under the collection's **Search engine listing**.
`content/collections.json` is the snapshot of that copy, keyed by handle.

### 6. Navigation

Menus live in Shopify admin, not in the theme. Build the main menu to six items:

```
Shop ▾ | Shop by Business ▾ | Wholesale | Rewards | About | Contact
```

The announcement bar is already set to the three rotating messages.

### 7. Search template for quick order

The quick order pad resolves SKUs through `templates/search.sku.liquid`, reached
at `/search?q=SKU&view=sku`. It returns exact SKU matches only. A near-miss comes
back as a visible miss rather than the wrong case landing in someone's cart. No
app or setup needed, but it does depend on Shopify's search having indexed the
products, which takes a few minutes after an import.

### 8. Form submissions

The wholesale application, quote request and sample request all post through
Shopify's contact form and arrive by email. Set the address under **Settings →
Notifications**. Each one tags itself with a hidden `Form` field so they can be
filtered apart.

### 9. Images

The 64-image library is wired but not uploaded. Everything resolves by filename,
so the one step is uploading the set to **Settings → Files** named exactly as the
image placement guide names them. Nothing is picked in the theme editor.

```bash
pip install Pillow
python3 scripts/prepare-images.py "path/to/the/png/set" ./webp
```

That converts the set to the WebP the theme expects and tells you what is missing
or the wrong shape. An unuploaded file renders nothing rather than breaking its
section, so the set can go up in any order.

`docs/image-placement.md` has the full map, the decisions taken where the guide
left a choice, and the short list of alt text that needs checking against the real
pictures.

### 10. Search engine setup

Everything a search engine reads is set, and the theme reads it from one place.

**Theme settings → Store identity & search** holds the brand name, the home
page's search title and description, the business contact details and the
social profile links. The brand name is what the `<title>` suffix and
`og:site_name` use, so the shop name in **Settings → General** (still "My
Store") only reaches checkout and email until it is renamed. The phone number,
city and social links are blank until filled in here; they feed the
Organization markup in the page head, and the footer falls back to the same
social links when its own are empty.

`snippets/meta-tags.liquid` builds the title and description for every page
type: the home settings above on the index, and Shopify's own search title and
description for products, collections and pages everywhere else, with the
brand suffix added only when the title does not already carry it. The header
section emits Organization and WebSite (site search) JSON-LD on every page,
and the FAQ section emits FAQPage JSON-LD from its own questions, with a
checkbox to turn that off.

The copy itself lives in Shopify admin, not in the theme:

| Where | What is written |
|---|---|
| Every product (309) | Title, description, search title, search description, alt text on every image |
| Every collection (39) | Description, search title, search description |
| Every page (13) | Search title, search description, summary body |

`content/products.json` and `content/collections.json` are a snapshot of that
copy as written, keyed by handle, so it can be diffed, restored or re-imported
if a bulk edit goes wrong. The admin is the source of truth: edit there and
refresh the snapshot, not the other way round.

Product titles follow one pattern: what it is, the size, the material, then
the supplier's model code in parentheses where that code is how buyers
reorder. Search titles keep the product name and add "Wholesale" or the case
count; search descriptions stay under 158 characters and say what the item is
for, that it is sold by the case, and that the per-piece price is shown.

---

## Deliberately not built

**No rating, average or verified badge on the customer quotes.** An average
implies a population of ratings, and a verified badge is a checkable claim that
an order exists under that name. With three illustrative quotes, both are inside
the FTC rule on testimonials. The section carries a note to this effect in the
theme editor.

The plan in the spec still holds: install a review app, fire the request eight
days after delivery, and at ninety days replace the quotes section with the app's
widget. At that point the badges and the average come back, legitimately. Keep
these quotes out of the review app so they can never be counted into a real
average.

**No invented testimonials.** The product page ends in a grid built for
twenty real quotes, three showing and a "View more" for the rest, each linked to
the product the buyer meant. Its first three slots carry the same three
illustrative quotes as the home page, placed there at the owner's request; the
other seventeen are empty and render nothing until a real quote goes in.
Writing testimonials and publishing them as buyers' words is what the FTC's
rule on consumer reviews and testimonials bans (16 CFR 465), so the three
illustrative quotes, on the home page and in the grid, should be swapped for
real ones, or removed, before the password comes off. Ask the buyer, keep their
words as said, pick the product they bought.

**No invented customer numbers.** "17 years sourcing this category" is true and
checkable. "Trusted by 400 kitchens" is a claim that would have to be defended.

---

## Still blocked

Carried from spec section 9. The bracketed gaps are left in the page copy
verbatim rather than filled with plausible inventions, because an industry buyer
spots an invented specific immediately.

1. Real case prices and pieces-per-case for all products. Pieces-per-case is the
   harder blocker: without it the per-piece display cannot render.
2. Gross margin by category, so tiers can be tuned per collection instead of one
   ladder across everything.
3. Both founders' full legal names and titles.
4. One true, specific, checkable story for the About page.
5. Founder photographs. A phone photo in good light is fine. Not a generated
   portrait, because B2B buyers reverse image search.
6. Whether Sunnyvale local pickup is still a real offer.
7. Whether cases are broken for single-unit buyers.
8. PFAS compliance documentation for the compostable line.
9. Resale certificate and tax exemption process.
10. Product photography for the 58 products that have no image.

Items 1 and 2 unblock pricing. Items 3, 4 and 5 fill every remaining bracket in
the page copy in one pass.

---

## Local development

```bash
shopify theme dev --store your-store.myshopify.com
shopify theme check
shopify theme push --theme "Restaurant Supply Hub"
```

Push to an unpublished theme first and check the product page against a product
that actually has `pieces_per_case` set.

Before every push, run the repo's own check:

```bash
python3 scripts/check-theme.py
```

Shopify's GitHub sync rejects a file silently when it fails the theme
validator, and it does not resend an unchanged file it once rejected, so a bad
file stays stale on the live theme with no error shown anywhere. The script
encodes every rule that has caught this theme so far: dynamic sources that
must be proven, schema names over 25 characters, `url` and `link_list`
defaults Shopify refuses, range defaults off the step, and template settings
that do not match their schema. When the sync still looks stuck,
`themeFilesUpsert` against an unpublished copy of the theme returns the
validator's real message.
