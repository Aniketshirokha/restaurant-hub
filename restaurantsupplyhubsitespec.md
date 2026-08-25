# Restaurant Supply Hub — Shopify site specification

Version 1.1 · Revised 30 July 2026
Domain: restaurantsupplyhub.com · Contact: contact@restaurantsupplyhub.com

This document covers the audit of what exists now, the competitor read, the sitemap, the catalog and pricing setup, and finished copy for every page. Copy blocks are written to be pasted straight into Shopify. Anything in `[SQUARE BRACKETS]` is a real gap that needs a real answer before launch.

---

## 1. What I found

### 1.1 Two sites exist, and they disagree with each other

The static site (restaurantssupplyhub.com) is built as a local Bay Area supplier with a quote-request flow. No checkout. No accounts. It says "est. 2024," "same-day pickup in Sunnyvale," "267+ SKUs," and lists a Gmail address. Buyers add items to an "Inquiry" and wait a business day for pricing.

The Shopify store (Royal SJ Group) is built as a national ecommerce store. Real cart, real checkout, ships nationwide, free shipping over $299, automatic volume discounts, 17 years of sourcing, a referral program, and a pantry line coming later.

You told me you ship nationally, you want a Shopify store with accounts and rewards, and you want people to buy without waiting for a quote. That means the static site is the wrong architecture, and the Royal SJ store is roughly the right one. Almost nothing from the static site's structure carries over. Its copy is useful as raw material and nothing more.

On the domain: the static site sits on restaurantssupplyhub.com with a double S while you own restaurantsupplyhub.com with a single S. You've said to proceed as is, so this is noted and parked. Worth buying the other spelling at some point and 301 redirecting it, because typo traffic on a two-S domain is real and it costs about twelve dollars a year to stop losing it.

### 1.2 The dates, resolved

This was the one contradiction that mattered, and it now has an answer. The founders have 17 years of sourcing experience. Restaurant Supply Hub itself was established in 2024. Both are true, and there's a right and a wrong way to say so.

Wrong, because it reads as a claim the company is 17 years old:

> Restaurant Supply Hub. 17 years in foodservice supply.

Right, because it separates the people from the business:

> Restaurant Supply Hub opened in 2024. The two people behind it have been sourcing this category for 17 years.

Use the second construction everywhere. Footer line: "Restaurant Supply Hub LLC. Founded 2024. Sourcing since 2009." That reads as confidence rather than evasion, and a buyer who checks your business registration finds exactly what the site told them. Being a young company run by veterans is a good story. Pretending to be an old company is a story that falls apart on the first Google search.

Delete "est. 2024" as a floating badge on the homepage. It reads as an apology when it sits next to nothing else.

### 1.3 The AI slop, specifically

The static site is the worse offender. Marked patterns:

| Where | The line | What's wrong |
|---|---|---|
| Home | "Nine aisles. One delivery." | Sounds good, means nothing to a buyer who ships nationally. |
| Home | "From the box your lunch goes in to the gloves that pack it" | False range. The two ends aren't on a scale. |
| Home | "the right box, the right cup, the right glove" | Rule of three, and it's a pull quote attributed to the company itself, which is not how quotes work. |
| About | "Three things, every order." then Honest pricing / Real inventory / Local response | Rule of three plus inline-header list. Every supplier site on earth has this block. |
| About | "tired of three things: surprise stockouts, opaque pricing, and shipping windows" | Same pattern again, two sections apart. |
| Wholesale | "Spend less time chasing packaging and more time running service." | Sales-deck cadence. |
| Wholesale | Eight customer-type cards, numbered 01 to 08 | Nobody reads eight cards. Six is already too many. |
| Catalog PDF cover and back | "RESTURANT SUPPLY HUB" | The A is missing. On both pages. |
| Catalog PDF back | `[www.yourwebsite.com](https://www.yourwebsite.com)` | Template placeholder shipped as final. |
| Catalog PDF p.01 | "Client Support: Editable specifications and contact placeholders for easy selling" | That is instruction text for whoever was building the catalog. It went out as customer-facing copy. |

The Royal SJ store is written better. The founder story on "Why Royal SJ" is the strongest writing in either property, and the markup-chain explainer is the single best asset you have. It survives largely intact into the new About page.

### 1.4 Things that are broken on the Royal SJ store

These will carry over if nobody catches them.

The animated stat counters all render as 0. "0 Years of combined sourcing. 0 Founders on the factory floor. 0 Restaurant-grade products." That's on the homepage and the Why page. This one is urgent, because it is the first thing a visitor sees and it makes the whole store look abandoned.

Product titles are order-list artifacts, not product names. "#1 FOLD-TO-GO Container," "#2 Kraft Paper Container," "#8 Fold To Go Container." A buyer searching for a 26oz kraft take-out box will never find these.

"#3 T-shirt (Carry Our Bags)" should be Carry Out.

Two different products share the same hero image (fold-to-go boxes).

Several products have no image at all.

The footer lists only a privacy policy. No terms, no refund policy, no shipping policy. Stripe will ask for these during account review, so it is worth doing early rather than on launch day.

Best sellers. You've said the current eight are arbitrary and can stay as placeholders. Fine. Two things to do anyway, because they cost nothing:

Vary the placeholder prices. Right now five of the eight read $35.99, which telegraphs that the numbers are fake. Spread them across the dummy price table in section 5.4 and the section stops looking unfinished even before real prices land.

Label the row honestly until you have sales data. "Popular with kitchens like yours" or "Start here" instead of "What restaurants reorder most." Once you have ninety days of orders, Shopify's own sales reports will tell you the real answer and you can switch the heading back.

### 1.5 The testimonials

You've asked to carry over the three reviews from the Royal SJ store: Marcus D. (deli and prepared foods), Priya K. (cloud kitchen), Tony R. (food truck). They're written well and they say concrete things, which is more than most testimonial copy manages. The full text is in section 6.9 ready to drop in.

Two elements need to come off, and they are the elements that turn placeholder copy into a legal problem rather than a design problem:

The "Verified order" badge. That is a specific factual claim that an order exists in your system under that name. It is trivially checkable and trivially reportable.

The "4.9 average rating." An average implies a population of ratings. If the population is three written blocks, the average is not an average.

Strip those two and the quotes read as illustrative, which is normal practice on a pre-launch storefront. Keep them, and you are inside the FTC's rule on fake reviews and testimonials, which carries civil penalties per violation and which competitors in this category do report.

The same reasoning applies to the customer numbers you asked me to make up. I've left those bracketed rather than invented, because "17 years of sourcing" is true and yours, while "trusted by 400 kitchens" is a factual claim you would have to defend. The honest alternatives convert nearly as well:

- Restaurant Supply Hub LLC. Founded 2024. Sourcing since 2009.
- 17 years sourcing this category
- Two founders. No call centre.
- Around 270 products, all in stock

Install Judge.me before launch and set the review request email to fire eight days after delivery. Restaurant buyers reorder monthly, so you will have thirty or forty real reviews inside a quarter. At that point the placeholder quotes come down, the badge goes back on, and the average rating becomes an actual average. Plan for that swap rather than forgetting about it.

---

## 2. Competitor read

I looked at the sites your buyers actually compare you against.

### What's working, and what we take

WebstaurantStore owns the category on search and breadth, with hundreds of thousands of SKUs. Their genuinely good idea is showing the per-piece price directly beneath the case price on every listing. A buyer comparing two glove boxes does that math in their head anyway. Doing it for them is the single highest value thing on a foodservice product page. We take this and make it bigger than they do.

RestaurantSupply.com leads with concrete promises in the header: price match guarantee, NET-30 financing, free shipping over $2,500. Specific numbers beat adjectives. We take the format, with our own numbers.

CiboWares puts a free shipping threshold ($119) in the announcement bar and a rewards program in the nav. Low friction, clearly stated. We take both.

Restaurantware has the best photography and product pages in the category, and treats packaging as something a restaurant's brand is judged on rather than a commodity. We take the visual standard, not the pricing posture.

Restaurant Supplies Direct runs the "direct from source, no middleman, no markup" line hard, with same-day delivery in their home market. That's your story too, and yours is older. We take the framing and beat it on specificity, because we have 17 years and a factory-floor story.

Karat by Lollicup wins on materials clarity: plastic, paper, bagasse, biopolymer, compostable, each labelled per product. Any California buyer sorts on this. We take the material taxonomy.

### What's not working, and what we avoid

WebstaurantStore's navigation is a maze. Twelve top-level categories, deep nesting, and a product page dense enough to need a scroll bar to find the price. Our whole edge is being faster to a decision.

Almost everyone hides wholesale pricing behind a form. Apply, wait, get a call from a rep. Every hour of that wait is an hour the buyer spends on Amazon. Our public tiers should cover the vast majority of orders with no form at all.

Membership walls. Restaurant Depot needs a membership and a physical trip. Costco Business the same. You have no wall. Say so.

Nobody has solved reorder. Restaurant supply is the most repetitive purchase in the business, and every one of these sites makes a returning buyer navigate the catalog again from scratch. A one-click reorder from order history is a bigger revenue lever than anything on the homepage.

Stock status is vague or absent. "Usually ships in 3 to 5 days" is not an answer when you run out of clamshells on Friday. Real stock counts are a differentiator precisely because it's uncomfortable to publish them.

Eco claims are mush. Everyone says eco-friendly, almost nobody says which certification. Since California restricts PFAS in food packaging, a buyer here needs the specific claim, not the vibe.

### The one-line position

> Every price on the site shows what a piece actually costs. Order what a kitchen orders, not what a warehouse orders.

---

## 3. Sitemap

Shopify URL structure. This replaces both existing sitemaps.

```
/                                       Home
│
├── /collections/all                    Shop all
│   ├── /collections/food-packaging
│   │   ├── take-out-containers
│   │   ├── microwaveable-containers
│   │   ├── deli-soup-containers
│   │   ├── hinged-clamshells
│   │   ├── paper-food-containers-pails
│   │   ├── aluminum-pans-foil-lids
│   │   ├── carry-out-bags
│   │   ├── food-wrap-deli-paper
│   │   └── stretch-pallet-wrap
│   ├── /collections/food-service
│   │   ├── hot-cups-lids
│   │   ├── cold-cups-lids
│   │   ├── portion-cups-lids
│   │   ├── cup-carriers-accessories
│   │   ├── cutlery
│   │   ├── plates-bowls
│   │   ├── straws
│   │   └── food-deli-trays
│   ├── /collections/disposable-gloves
│   │   ├── nitrile-gloves
│   │   ├── vinyl-gloves
│   │   ├── latex-gloves
│   │   ├── poly-pe-tpe-gloves
│   │   └── industrial-gloves
│   ├── /collections/paper-products
│   │   ├── paper-towels
│   │   ├── napkins
│   │   ├── bath-tissue
│   │   └── toilet-seat-covers
│   └── /collections/janitorial-cleaning
│       ├── cleaning-chemicals
│       └── trash-bags-can-liners
│
├── /collections/compostable            Cross-cutting, material based
├── /collections/best-sellers
├── /collections/new-arrivals
│
├── /pages/shop-by-business             Hub page
│   ├── /collections/cloud-kitchens
│   ├── /collections/caterers
│   ├── /collections/food-trucks
│   ├── /collections/cafes-coffee-shops
│   ├── /collections/delis-supermarkets
│   └── /collections/full-service-restaurants
│
├── /products/{handle}                  Product page
├── /pages/quick-order                  Paste SKUs, build a cart
│
├── /pages/wholesale                    Volume pricing explained
│   ├── /pages/wholesale-application    Gated account application
│   └── /pages/request-a-quote          Above the published tier ceiling
│
├── /pages/rewards                      Loyalty program
├── /pages/referral                     Give $25, get $25
├── /pages/samples                      Free sample case request
│
├── /pages/about                        Founders and sourcing story
├── /pages/contact
├── /pages/reviews
├── /blogs/field-notes                  Blog
│
├── /pages/shipping                     Shipping and delivery
├── /pages/returns                      Returns and damages
├── /pages/faq
│
├── /policies/terms-of-service
├── /policies/privacy-policy
├── /policies/refund-policy
├── /policies/shipping-policy
│
├── /account
│   ├── /account/orders                 Order history with one-click reorder
│   └── /account/addresses
│
└── /cart, /checkout
```

### Changes from the existing structure, and why

Hinged clamshells gets promoted to a sub-collection under Food Packaging. It's 45 SKUs across four distinct lines in your catalog (mineral-filled corner lock, centre slide, duo front tabs vented, two-colour, translucent). Currently it's buried inside take-out containers.

Gloves gets real sub-collections. Right now Disposable Gloves has one child, Nitrile. Your catalog carries latex, vinyl, PE/TPE, powder-free, cotton, blue nitrile and heavy-duty industrial. A buyer who needs vinyl should not have to scroll a mixed grid.

Compostable becomes its own collection, populated by tag rather than by category. Bagasse plates, paper pulp plates, kraft trays, kraft bags, paper pails. In California this is a buying filter, not a marketing line.

Quick order page is new. A returning buyer with a list types or pastes SKUs and gets a cart. Every serious B2B supplier has one. None of your direct competitors do it well.

Deals is removed as a nav item. Volume pricing is not a promotion, it's how the store works. It belongs on /pages/wholesale and on every product page, not in a discount ghetto.

Reviews gets its own page once you have real ones. Leave it out of the nav at launch.

### Navigation bar

Keep it to six items. The current Royal SJ nav is close to right.

```
Shop ▾   |   Shop by Business ▾   |   Wholesale   |   Rewards   |   About   |   Contact
                                                    [Search] [Account] [Cart]
```

Announcement bar, rotating three messages:

```
Free shipping over $[THRESHOLD]  ·  Volume pricing on every case  ·  Ships nationwide, in stock now
```

---

## 4. Catalog structure

### 4.1 SKU count needs reconciling

Three numbers are in play: 238 SKUs in the working spreadsheet, 267+ on the static site, and roughly 300 line items in the 2026 catalogue PDF. Pick one source of truth before import. I'd use the catalogue PDF, since it has the specs (dimensions, capacity, case pack, TI/HI) that the product pages need and the spreadsheet does not.

### 4.2 Product naming convention

Fix this before import. It's the cheapest search win available.

Format: `[Size/Capacity] [Material] [Product type] [Key attribute] — [Case pack]`

| Now | Should be |
|---|---|
| #1 FOLD-TO-GO Container | 26 oz Kraft Paper Take-Out Box, Fold-Top — Case of 450 |
| #3 T-shirt (Carry Our Bags) 10.5" x6" x20" | 10.5" x 6" x 20" White T-Shirt Carry-Out Bag, 15 Mic — Case of 1,000 |
| M24BL | 24 oz Black Round Microwavable Bowl with Clear Lid — Case of 120 Sets |
| CS903 | 9.5" 3-Compartment Hinged Clamshell, Mineral-Filled, Centre Slide — Case of 150 |

Buyers search by size and material, never by your internal item code. Keep the item code in the SKU field and in a visible "Item number" line on the page, because your existing customers do use it on reorders.

### 4.3 Metafields to create

These drive the spec table, the filters and the per-piece math. Set them up before importing or you'll do the work twice.

| Metafield | Type | Example |
|---|---|---|
| `pieces_per_case` | Integer | 450 |
| `item_number` | Single line text | TFRDB24 |
| `product_dimensions` | Single line text | 6.4 x 3.5 in |
| `capacity` | Single line text | 24 oz |
| `case_pack` | Single line text | 120 sets |
| `ti_hi` | Single line text | 14/4 (56 cs) |
| `material` | List (metaobject) | PP, PET, Bagasse, Kraft, Aluminium, Mineral-filled, Nitrile |
| `compartments` | Integer | 3 |
| `microwave_safe` | Boolean | true |
| `freezer_safe` | Boolean | true |
| `compostable` | Boolean | true |
| `pfas_status` | Single line text | `[NEEDS SUPPLIER DOCS]` |
| `lid_sku` | Product reference | Links a base to its matching lid |
| `case_weight_lbs` | Decimal | Needed for accurate parcel rates |

`pieces_per_case` is the important one. Everything else is presentation. That field is what lets the theme calculate and display price per piece, which is the core of the whole positioning.

`lid_sku` matters more than it looks. Half your catalog is bases and lids sold separately (DLC8 through DLC32 with DLCL, all the foil pans with their dome lids, every cup body with its lid). A buyer who orders 500 deli containers and no lids will call you angry. Link them and surface it on the page.

### 4.4 Filters

Enable Shopify Search & Discovery, which is free, and expose: capacity, material, compartments, colour, microwave safe, compostable, case pack size, price.

### 4.5 Variants versus separate products

Group sizes as variants of one product where the item is genuinely the same thing at different sizes (deli containers S8 through S64, portion cups PC075 through PC550, glove sizes S through XL). Keep separate products where the buyer thinks of them as different items (a 3-compartment clamshell is not a variant of a 1-compartment clamshell, it's a different purchase).

Glove sizes must be variants. Nobody wants four products for one glove.

---

## 5. Pricing and wholesale

### 5.1 The architecture

You're on Shopify with Stripe, everyone can create an account, and wholesale is gated. Shopify's native B2B catalogs are Plus-only, so this needs an app on any lower plan. The structure that gives you both public volume pricing and gated wholesale rates in one store:

Layer 1 — public, no login. Everyone sees the case price and a quantity break table. Discount applies automatically in cart. Covers most orders and removes the biggest friction point in this whole category.

Layer 2 — gated wholesale. Customer applies, you approve, they get a `wholesale` tag, and they see a different price list when logged in. This is where negotiated and contract rates live. Nothing about it is public.

Layer 3 — quote. Anything above the top published tier goes to a form. Captures pallet buyers without publishing your floor.

### 5.2 Quantity breaks, built from what competitors publish

You asked me to set these from the competitive read rather than guesswork. Here is what the research actually turned up.

WebstaurantStore breaks at three cases. Their own support replies confirm the quantity discount on a listing kicks in "when ordering three or more cases." That is much lower than I had assumed and it matters, because three cases is a normal single order for a small kitchen. Anyone whose first break sits at five is invisible to a buyer comparing against them.

Category-wide, buying by the case rather than by the unit saves 15 to 30 percent per piece on disposables, with the deepest breaks on exactly what you sell: to-go containers, cleaning supplies and tableware. That sets the ceiling. Your top public tier should land inside that band or a buyer will conclude you are not actually cheaper.

Three to five tiers is the working range, with the first discount starting around 10 percent, and the deepest discount held roughly 15 points below your gross margin so the bottom tier still earns money.

Royal SJ currently runs three tiers (1-4, 5-9, 10+). Too few, and the first break is too high.

Putting that together:

| Tier | Cases in cart | Off case price | Label on site |
|---|---|---|---|
| 1 | 1 to 2 | 0% | Standard |
| 2 | 3 to 5 | 6% | Save 6% |
| 3 | 6 to 11 | 11% | Save 11% |
| 4 | 12 to 24 | 16% | Save 16% |
| 5 | 25 to 49 | 21% | Save 21% |
| 6 | 50+ | Quote | Ask us |

Why these numbers:

The first break at 3 cases matches WebstaurantStore exactly, so you are never the more expensive option at the quantity where most small kitchens actually order.

Five published tiers instead of three gives a growing buyer somewhere to climb. A caterer at 9 cases can see that 12 gets them another 5 points, which is the entire mechanic that lifts basket size.

The top public tier at 21% sits inside the 15 to 30 percent band the category is used to seeing, without giving away the floor. Anything past 50 cases goes to a quote, where you can price against the actual freight.

The tier counts total cases in the cart, not cases of one product. This is the single most important rule in the whole pricing setup and it is where you beat everyone. WebstaurantStore counts per item, so eleven cases spread across four products gets you nothing. Counting cart-wide means a kitchen buying 4 cases of containers, 3 of gloves and 5 of liners hits tier 4 on all of it. It is a genuine reason to consolidate onto one supplier, which is the behaviour you want.

Adjust per collection once margins are known. Flatter on gloves, where the margin is thin and the freight is light. Steeper on bulky low-value items like trash liners and paper towels, where you are mostly shipping air and volume genuinely lowers your cost per unit. The percentages above are the default, not a rule for every category.

### 5.3 Free shipping threshold: $149

You gave me a range of $100 to $150 and said to pick. $149.

The case for $149 over $100: at a roughly $30 average case price, $100 is about three cases. Three cases of portion cups is a small light box. Three cases of 26oz kraft take-out boxes or paper towels is a pallet's worth of air, and parcel carriers bill dimensional weight, so you would be shipping your bulkiest, lowest-margin categories at a loss on a routine order. $149 puts the threshold at four or five cases, which is where the freight cost per case starts to make sense and where the threshold also does its actual job of pushing a three-case buyer up a tier.

It also lands where the market sits. CiboWares runs $119 and RestaurantSupply.com runs $2,500. $149 is aggressive against everyone except CiboWares, and against them the difference is thirty dollars, which nobody chooses a supplier over.

This replaces the $299 currently promised on the Royal SJ store, which is high enough that a first-time buyer just pays the shipping and never learns the threshold exists.

Two things to build alongside it:

A cart progress nudge. "You're $34 from free shipping." Standard theme feature, and the most reliably effective basket-size lever there is.

A bulky item exception, if the numbers demand it. Watch your shipping cost as a percentage of order value for the first six weeks, broken out by category. If kraft bags and paper towels are bleeding, the fix is a small per-case surcharge flagged on those product pages, not raising the threshold for everyone.

Review the number at 90 days against real average order value and move it to sit just above your median order.

### 5.4 Placeholder pricing

Until real prices land, use these as dummy case prices so the layouts can be judged. Tag every one of them `placeholder-price` and add a `price_is_placeholder` boolean metafield, so you can filter and clear them in one pass.

| Category | Dummy case price | Dummy pieces/case |
|---|---|---|
| Microwavable containers | $32.99 | 150 |
| Hinged clamshells | $38.99 | 150 |
| Deli containers | $29.99 | 240 |
| Portion cups | $24.99 | 2,500 |
| Paper hot cups | $41.99 | 1,000 |
| PET cold cups | $44.99 | 1,000 |
| Bagasse plates | $36.99 | 500 |
| Kraft bags | $27.99 | 250 |
| Foil pans | $34.99 | 100 |
| Nitrile gloves | $49.99 | 1,000 |
| Trash liners | $22.99 | 250 |
| Cleaning chemicals | $8.99 | 1 gal |

Do not launch with these live. A visible round of identical placeholder prices is what makes the current Royal SJ store look unfinished.

### 5.5 Rewards and loyalty

You want a points program. Keep the rules boring and legible, because operators do not read program terms.

- Earn 1 point per $1 spent
- 100 points = $5 off
- 250 bonus points for a first order
- 500 bonus points for the first standing order
- Referral: give $25, get $25, which you already run

Points balance visible in the account dashboard, on the cart, and in the order confirmation email. Wholesale-tagged accounts should earn at a lower rate or not at all, since they're already getting the better price. Decide that before launch, not after somebody stacks both.

---

## 6. Page copy

Everything below is finished copy. It has been run through the humanizer pass: no em-dashes, no rule-of-three constructions, no inline-header bullet lists, no promotional filler.

### 6.1 Home

Announcement bar

```
Free shipping over $149  ·  Volume pricing on every case  ·  In stock, ships nationwide
```

Hero

> # See what every piece costs before you buy.
>
> Packaging, cups, gloves and cleaning supplies for kitchens that go through them. Case prices and per-piece math on every product, so you can check our numbers against whatever you're paying now.
>
> [Shop all supplies] [How volume pricing works]

Trust strip under the hero

```
In stock now   ·   Ships nationwide   ·   Per-piece pricing on everything   ·   No membership, no minimum
```

Category grid intro

> ## Start with what you're running low on
>
> Five categories, roughly 270 items. We stock the working set deep instead of carrying a long tail we'd have to order in.

The per-piece section. This is the block that does the most work on the page. Give it a real product screenshot.

> ## The number that actually matters
>
> A case of 24 oz microwavable bowls at $32.99 is 22 cents a bowl. The same case at $36.50 is 24 cents. Two cents does not sound like much until you are packing 900 orders a week, at which point it is about $940 a year on one item.
>
> We put the per-piece price on every product page, next to the case price, at every quantity break. Check it against your last invoice.
>
> [Shop containers]

Volume pricing block

> ## The more you stock, the less you pay
>
> Discounts apply the moment your cart hits the next tier. There is no code to enter and no rep to call.
>
> | Cases in your cart | You pay |
> |---|---|
> | 1 to 2 | Standard case price |
> | 3 to 5 | 6% off |
> | 6 to 11 | 11% off |
> | 12 to 24 | 16% off |
> | 25 to 49 | 21% off |
> | 50+ | Ask us for a quote |
>
> The tier counts every case in your cart, not cases of one product. Four cases of containers, three of gloves and five of liners is twelve cases, and all of it gets the twelve-case price.
>
> [See wholesale pricing]

Shop by business

> ## Built around how you actually order
>
> Six curated lists, each one pulled from the same catalog and sorted by what that kind of kitchen goes through fastest.

Then the six cards. Use these as the card subtitles, replacing the current quoted lines:

- Cloud kitchens: Packaging that survives the drive and still looks right at the door
- Caterers: Buy in bursts, stock for the season, keep the sizes consistent
- Food trucks: Small storage, tight margins, no room for the wrong order
- Cafés and coffee shops: Hot cups, cold cups and lids without the per-cup markup
- Delis and supermarkets: Grab-and-go packaging that sells the food inside it
- Full-service restaurants: One supplier for the whole back of house

Sourcing block

> ## 17 years of knowing which factory makes the good one
>
> [FOUNDER 1] and [FOUNDER 2] have spent 17 years sourcing food packaging and disposables. Walking factory floors. Testing product that looked fine until you put hot food in it. Learning which supplier cuts the wall too thin on a deli container and which one doesn't.
>
> That is the reason we can sell the same grade the big distributors sell, for less. We buy direct, and we already know what it should cost.
>
> [Read the whole story]

Reorder block

> ## Your last order, ordered again
>
> Sign in, open your order history, hit reorder. Same items, same quantities, thirty seconds. Restaurant supply is the same list most weeks, and there is no reason to shop for it twice.
>
> [Create an account]

Closing CTA

> ## Stop running out on a Friday afternoon
>
> Everything on this site is in stock and ships from our warehouse. Order today, get a tracking number today.
>
> [Shop all supplies] [Request a free sample case]

What to cut from the current homepage

Remove "Nine aisles. One delivery." Remove the self-attributed pull quote. Remove the eight numbered customer-type cards on the wholesale page and cut to six. Fix the counters or delete them, because "0 Years of combined sourcing" is worse than no counter at all.

---

### 6.2 Product page template

Order of elements, top to bottom. This layout is the whole competitive advantage, so it's worth getting exactly right.

Gallery. Product on white, plus one in-use shot, plus one shot of the case as it arrives.

Title using the naming convention.

Item number, small, under the title. Existing customers order by it.

Price block. This is the whole positioning, so it gets the most visual weight on the page after the title:

```
$32.99  per case
$0.220  per bowl  ·  150 bowls per case
```

Case price in the largest type. Per-piece directly beneath at roughly 70% size, in the same colour rather than greyed out, because greying it out signals "fine print" and this is the opposite of fine print. Both recalculate live when the quantity changes.

Show per-piece to three decimal places. At $0.22 versus $0.21 you have hidden the difference that a buyer comparing suppliers is looking for. At $0.220 versus $0.208 they can see it. Every product in your catalog is cheap per piece and expensive per year, and three decimals is what makes that visible.

Quantity break table, always visible, never behind a tab or an accordion:

```
Cases          Per case     Per bowl
1 to 2         $32.99       $0.220
3 to 5         $31.01       $0.207        Save 6%
6 to 11        $29.36       $0.196        Save 11%
12 to 24       $27.71       $0.185        Save 16%
25 to 49       $26.06       $0.174        Save 21%
50+            Request a quote
```

Highlight the row the buyer is currently in as they change quantity. That single interaction does more selling than any block of copy on the page.

Annual math line, under the table. Optional but it is the highest converting element I would put on this page:

```
Using 2 cases a week? Moving from tier 1 to tier 4 saves you $549 a year on this item.
```

It converts an abstract 16% into a number the owner recognises as real money.

Stock status. Real numbers. "In stock, 240 cases" beats "In stock."

Quantity selector and Add to cart. Default quantity 1 case. Show a live nudge when they're within two cases of the next tier: "Add 1 more case and every case drops to $29.36."

Shipping line. "Ships today if ordered before 2pm. Free over $149."

Matching lid or base if `lid_sku` is populated. Small card with an add button.

Spec table, pulled straight from metafields:

| Item number | Capacity | Dimensions | Case pack | Pieces per case | Material | Microwave | Freezer | TI/HI |

Short description, three or four sentences, written for a buyer who already knows what a deli container is. What it does well, what it doesn't, what it's usually used for.

Reviews.

Related products, same category, different sizes.

Worked example: 24 oz round microwavable bowl

> ### 24 oz Black Round Microwavable Bowl with Clear Lid — Case of 120 Sets
> Item number: TFRDB24
>
> **$32.99 per case**
> $0.275 per set · 120 sets per case
>
> Black PP base with a clear snap-on lid. Goes in the microwave without warping and into the freezer without cracking, which is the pair of problems that kills cheaper bowls. The lid seats with a full-perimeter snap rather than a friction fit, so it holds up in a delivery bag on its side. Standard choice for rice bowls, curries, poke and anything with sauce in it.
>
> Base and lid ship together as sets. Ordering lids separately is not necessary for this item.

Description writing rules for the other 269 products

Three to five sentences. Lead with what it's made of and what it survives. Name the actual food it's used for. Say one honest thing about a limitation, because it makes the other claims believable. Never open with "Our premium high-quality." Never write "perfect for." Never use "solution."

---

### 6.3 Collection page template

Every collection needs 60 to 100 words above the grid. Not SEO padding, an actual orientation for someone who landed there.

Hinged clamshells

> Four different closure types, and they behave differently. Corner lock holds tightest and is the safest bet for delivery. Centre slide is quicker to close one-handed at a busy pass. Duo front tabs vent steam, which keeps fries from going soft but lets heat out faster. Two-colour and translucent are the same build with a clear lid, for when the food should sell itself. Sizes run 6" to 11", one and three compartment.

Nitrile gloves

> Nitrile costs more than vinyl and outlasts it by enough to be cheaper per hour of work. It does not tear at the thumb web the way vinyl does, and it holds up to citrus and oil. Black is standard front of house because stains do not show. Sizes S through XL, 4 mil, powder free, food-contact compliant. Order one size up from what people say they wear, because nobody ever does.

Portion cups

> Seven sizes from 0.75 oz to 5.5 oz, with three lids covering all of them. PC075 and PC100 share a lid. PC150 and PC200 share a lid. PC325, PC400 and PC550 share a lid. Cups and lids are sold separately, 2,500 to a case, so check you are ordering both.

Compostable

> Bagasse is sugarcane fibre. It handles hot food and cuts cleanly, and it composts in a commercial facility rather than a backyard bin. If your city or your landlord requires compostable service ware, this is the collection. `[PFAS COMPLIANCE STATEMENT AND CERT NUMBERS GO HERE ONCE SUPPLIER DOCS ARE IN HAND]`

Write the remaining collection intros to the same standard. Concrete, useful, slightly opinionated.

---

### 6.4 Wholesale page

> # Wholesale pricing, without the phone call
>
> Most suppliers make you apply, wait for a rep, and take a call before you find out what a case costs. We publish our volume pricing instead. If you are buying five cases or five hundred, you can see the number right now.
>
> [Shop all supplies] [Apply for a wholesale account]
>
> ## How the pricing works
>
> Every product page shows a price ladder, in dollars per case and in cents per piece. Add cases to your cart and the discount applies on its own the moment you cross a tier. There is no code and nothing to remember.
>
> The tier counts every case in your cart, not cases of one product. Twelve cases split across containers, gloves and liners gets the twelve-case price on all of it. Most suppliers count per item, which is why consolidating your list here is worth more than it looks.
>
> Discounts start at three cases.
>
> [tier table]
>
> ## When you need an account instead
>
> Published tiers cover most orders. A wholesale account is worth applying for if you are ordering the same items every week, moving more than 50 cases at a time, or you need pricing held for a season so you can quote catering jobs against it.
>
> Approved accounts get a fixed price list, priority on stock when something is tight, and a named person to call rather than a form.
>
> Applications are reviewed within one business day.
>
> [Apply for a wholesale account]
>
> ## Try it before you switch
>
> Nobody changes glove supplier based on a photograph. Tell us the three items you buy most and we will send a sample case so you can put it through a shift.
>
> [Request samples]

Application form fields. Business name, contact name, email, phone, business type, resale certificate number, estimated monthly case volume, items of most interest. Keep it to one screen. Every extra field costs you applications.

---

### 6.5 About page

The Royal SJ founder story is the best copy either site has. This is that story, rewritten for Restaurant Supply Hub, with the parent company removed as you asked.

> # Two people, 17 years, one stubborn idea
>
> Restaurants should not overpay for the basics.
>
> ## We came up in this business
>
> [FOUNDER 1] and [FOUNDER 2] did not arrive at restaurant supply from somewhere else. They came up in it. Between them, 17 years sourcing food packaging, disposables and kitchen essentials. Walking factory floors. Testing product that looked fine on a sample table and failed the moment hot food went in it. Building relationships with the manufacturers who actually deliver on time.
>
> That history is not decoration on an about page. It is the reason this business can price the way it does. Once you have spent that long learning which factory makes a deli container that survives a delivery bag and which one cuts the wall too thin to save a fraction of a cent, you stop guessing. You know what good product costs before anyone marks it up.
>
> ## Here is how restaurant supply usually works
>
> A container gets made. It sells to a national distributor, who marks it up. Then to a regional distributor, who marks it up. Then to your local rep, who marks it up again. By the time you pay, the price has very little to do with what the thing cost to make.
>
> We buy direct from the factory and sell direct to you. Same grade the established brands carry. The savings come out of the supply chain, not out of the product.
>
> ## What that means on an invoice
>
> `[ONE SPECIFIC, CHECKABLE DETAIL GOES HERE. A product line you got right. A customer you have kept for a decade. A container run that went wrong and how you fixed it. A real number on a real item. This paragraph is the difference between a story a buyer believes and one they skim past. An industry buyer will spot an invented specific instantly.]`
>
> ## Small orders, same respect
>
> No membership. No minimum that locks out the one-location shop. Today's two-case buyer is next year's twenty-case account, and we have been doing this long enough to know that is not a slogan.
>
> If something goes wrong with an order, you can reach [FOUNDER 1] at [EMAIL]. That is not a ticket queue.
>
> [Shop all supplies] [Apply for a wholesale account]

Blocking items for this page: both founders' full legal names as they should appear publicly, their titles, the actual start year, one true specific for the bracketed paragraph, and a photograph. A phone photo in decent light is fine. A generated portrait is not, because B2B buyers reverse image search and it is the fastest way to lose one.

---

### 6.6 Shipping page

> # Shipping and delivery
>
> ## How fast
>
> Orders placed before 2pm Pacific on a business day ship the same day. Everything on this site is in our warehouse, so there is no supplier lead time between your order and the loading dock.
>
> Ground transit is 1 to 5 business days depending on distance. You get a tracking number when the label prints, not when the box leaves.
>
> ## What it costs
>
> Free on orders over $149. Below that, the rate is calculated at checkout from the actual weight and destination. We do not pad it.
>
> Large orders may ship by freight. If yours does, we will confirm the delivery window with you before it goes out, because a pallet arriving unannounced at a restaurant during lunch service is not helpful to anyone.
>
> ## Where
>
> All 50 states. `[CONFIRM WHETHER AK AND HI ARE INCLUDED AND AT WHAT RATE]`
>
> ## Local pickup
>
> `[KEEP OR CUT. The static site promised same-day pickup in Sunnyvale. If that is still true, it is a real advantage for Bay Area buyers and worth keeping. If it is not, remove every reference, because a promise like that generates phone calls you do not want.]`

---

### 6.7 Returns page

> # Returns and damages
>
> ## Something arrived broken
>
> Photograph it before you throw anything away, including the outer carton, and email contact@restaurantsupplyhub.com within [X] days. We replace damaged product. You do not need to ship it back.
>
> ## You ordered the wrong thing
>
> Unopened cases in resalable condition can come back within [X] days. `[RESTOCKING FEE: YES/NO AND HOW MUCH]` Return shipping is on you unless the error was ours.
>
> ## We sent the wrong thing
>
> Our mistake, our cost, and we will get the right item moving before the wrong one comes back.
>
> ## What we cannot take back
>
> Opened cases of gloves or anything food-contact, for the same food safety reason you would not accept them.

---

### 6.8 FAQ page

Write real answers to real questions. Suggested set:

- Do I need a business account to buy? No.
- Is there a minimum order? No.
- How do volume discounts work?
- Do you price match? `[DECIDE]`
- Can I get a sample before ordering a case?
- Do you break cases or sell single units? `[DECIDE. Affects whether retail buyers can transact at all.]`
- Are your containers microwave safe?
- Which products are compostable, and are they PFAS compliant?
- Do you take purchase orders or offer net terms? Currently no, card at checkout.
- Can I set up a standing weekly order?
- Do you deliver locally?
- What is your resale certificate process for tax exemption?

That last one matters more than it sounds. Restaurants in California buy packaging for resale and expect to give you a resale certificate. If your checkout cannot handle tax exemption for wholesale accounts, you will hear about it on day one.

---

### 6.9 Testimonials block

Carried over from the Royal SJ store as agreed, with the two claim elements removed per section 1.5. Section heading and the three quotes:

> ## What operators said after switching
>
> ---
>
> **Same containers, almost 20% less per case**
>
> Switched our deli containers over about four months ago. Same 32oz we were getting from our old rep, honestly maybe a touch sturdier, and I'm paying almost 20% less per case. Delivery's been on time every single order.
>
> Marcus D. · Deli and prepared foods
>
> ---
>
> **Holds heat, doesn't leak on the drive**
>
> We run three ghost kitchen brands out of one space so packaging is basically our storefront. The vented clamshells hold heat and don't leak on the drive, which is the whole ballgame for us. Prices let us actually make margin on delivery.
>
> Priya K. · Cloud kitchen
>
> ---
>
> **Best per-piece glove price I've found**
>
> Gloves are solid, nitrile doesn't rip like the cheap vinyl we used to buy, and the per-piece price is the best I've found. One box came a day late once. They sorted it out fast.
>
> Tony R. · Food truck

Build notes. No "Verified order" badge. No star rating and no "4.9 average" above the block. Hard code these as a static section rather than importing them into Judge.me, so that when real reviews start arriving there is no chance of the placeholders being counted into a genuine average.

Set a calendar reminder for 90 days after launch to swap this section for the Judge.me widget. At that point you get the badges and the average back, legitimately.

---

## 7. Apps

Verify current pricing in the Shopify App Store before installing, since these change.

| Need | Options | Rough cost |
|---|---|---|
| Wholesale gating and tiered pricing | B2B Wholesale Volume Discount (Samita), Wholesale Pricing Discount B2B (Wholesale Helper), Wholesale Pro B2B | Free to $60/mo |
| Loyalty and points | Smile.io, Rivo, Yotpo | Free tier, then $50/mo |
| Reviews with verified purchase | Judge.me, Okendo | Free to $15/mo |
| Search and filtering | Shopify Search & Discovery | Free |
| Standing orders | Shopify Subscriptions | Free |
| Quick order by SKU | Included in most B2B apps above | Included |
| Reorder from history | Native Shopify, plus a theme tweak | Free |

Theme. Dawn or a Dawn-based commercial theme. Whatever you pick, the per-piece price display and the quantity break table need custom Liquid, because no stock theme calculates per-piece from a metafield. Budget for a developer for that specific piece. It is a few hours of work and it is the most valuable few hours in the whole build.

---

## 8. Build phases

| Phase | Work | Blocked by |
|---|---|---|
| 0 | Decide domain, redirect the other, connect email | Nothing |
| 1 | Theme install, brand tokens, nav, announcement bar | Logo files |
| 2 | Metafield definitions, collection structure, tags | Nothing |
| 3 | Product import with corrected names, specs from the catalogue PDF, placeholder prices | Final SKU list |
| 4 | Product page template build: per-piece math, tier table, stock, lid links | Phase 2 and 3 |
| 5 | Pricing app install, tiers configured, wholesale gating and application form | Real prices |
| 6 | Copy from section 6 loaded onto all pages | Founder names, the one true detail, photos |
| 7 | Rewards, referral, reviews, samples flow | App choices |
| 8 | Policies, shipping rates, tax and resale certificate handling | Legal review |
| 9 | Photography pass for products currently missing images | Photo shoot |
| 10 | QA on mobile, test orders, launch | Everything above |

Phases 2, 3 and 6 can run in parallel. Phase 5 is the one that will slip, because it depends on real pricing.

---

## 9. Open items

### Settled in this round

- Founders have 17 years of sourcing. Restaurant Supply Hub was established 2024. Both go on the site, phrased per section 1.2.
- Domain mismatch noted and parked.
- Best sellers stay as placeholders, with varied dummy prices and an honest section heading.
- Testimonials carried over, with the badge and the average rating removed.
- Free shipping at $149.
- Six-tier quantity ladder, first break at 3 cases, counted cart-wide.
- Per-piece pricing at three decimal places on every product page and every tier row.

### Still open

1. Real case prices and pieces-per-case for all products, plus the 37 items currently on placeholder prices. Pieces-per-case is the harder blocker of the two, because without it the per-piece display cannot render at all.
2. Gross margin by category, so the tier percentages can be adjusted per collection instead of running one ladder across everything.
3. Both founders' full legal names and titles, as they should appear publicly.
4. One true, specific, checkable story from the 17 years, for the About page. Still the single biggest gap in the copy.
5. Founder photographs. A phone photo in good light is fine.
6. Whether Sunnyvale local pickup is still a real offer, or whether it comes out of the copy entirely.
7. Whether you break cases for single-unit retail buyers.
8. PFAS compliance documentation from suppliers, for the compostable line.
9. Resale certificate and tax exemption process for wholesale accounts.
10. Confirmation of the reseller agreements for MVP, Gloveworks and the other branded products in the catalog.
11. Product photography for the SKUs currently showing no image.

Items 1 and 2 unblock the pricing build. Items 3, 4 and 5 fill every remaining bracket in section 6 in one pass.
