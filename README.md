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
| **Trust strip** | Home |
| **Per-piece explainer** | Home |
| **Volume pricing table** | Home, Wholesale |
| **Shop by business** | Home, Shop by business |
| **Customer quotes** | Home, Reviews |
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

Create each page under **Content → Pages** and assign the matching template. The
copy is already in the templates, so the page body can stay empty.

| Page handle | Template |
|---|---|
| `wholesale` | `page.wholesale` |
| `wholesale-application` | `page.wholesale-application` |
| `request-a-quote` | `page.request-a-quote` |
| `quick-order` | `page.quick-order` |
| `shop-by-business` | `page.shop-by-business` |
| `about` | `page.about` |
| `shipping` | `page.shipping` |
| `returns` | `page.returns` |
| `faq` | `page.faq` |
| `rewards` | `page.rewards` |
| `referral` | `page.referral` |
| `samples` | `page.samples` |
| `reviews` | `page.reviews` |

### 5. Collections

Build the structure in spec section 3. The five parents are Food Packaging, Food
Service, Disposable Gloves, Paper Products and Janitorial & Cleaning, plus
`compostable` populated by tag rather than by category, and the six
`shop-by-business` collections the cards point at.

Then point the Shop by business cards at those collections in the theme editor,
and pick the five parent categories in the **Start with what you're running low
on** section on the home page. A card with a collection picked takes its title,
image and link from the collection, so renaming the collection cannot leave the
card stale.

Each collection needs 60 to 100 words above the grid, per spec section 6.3. That
copy is written and ready to paste in [`docs/collection-intros.md`](docs/collection-intros.md);
it goes in the collection description in admin, because the collection template
already renders the description above the product grid.

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

---

## Page copy

Every page in spec section 6 is loaded into its template, brackets and all. The
stock Tinker demo copy is gone from the home page (the category grid, the best
seller row and the sourcing block), from the product page (the four virtue icons
and the two accordion rows) and from the footer.

Two things are deliberately worded down from what the store could claim:

The best seller row is headed **Popular with kitchens like yours** rather than
"What restaurants reorder most", because there is no order history behind it yet.
Spec section 1.4. Swap the heading once ninety days of sales reports can answer
the question honestly.

The footer reads **Restaurant Supply Hub LLC. Founded 2024. Sourcing since
2009.** The company and the founders' experience are two different numbers and
the footer says so. Spec section 1.2.

The social links in the footer ship empty rather than pointing at the networks'
home pages. Fill them in the theme editor or the icons stay hidden.

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
10. Product photography for SKUs with no image.

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
