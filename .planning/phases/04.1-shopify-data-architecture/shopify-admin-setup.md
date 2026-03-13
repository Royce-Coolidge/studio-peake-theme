# Shopify Admin Setup Guide -- Studio Peake Data Architecture

This guide covers all Admin-side configuration required before custom sections can query data. Follow each section in order.

---

## Section 1: Metaobject Type Definitions

Create these in **Settings > Custom data > Metaobjects > Add definition**.

### 1.1 Project

- **Type name:** `project`
- **Display name:** Project
- **Access:** Storefronts (enable "Storefronts" access; leave "Online Store" off for now)
- **Display name field:** `title`

| Field key        | Display name    | Type                          | Validation / Notes                           |
|------------------|-----------------|-------------------------------|----------------------------------------------|
| `title`          | Title           | Single line text              | Set as display name field                    |
| `category`       | Category        | List of single line text      | Values like "residential", "commercial", "hospitality" |
| `hero_image`     | Hero Image      | File (image only)             | Accept: Images only                          |
| `gallery_images` | Gallery Images  | List of files (images only)   | Accept: Images only                          |
| `video_url`      | Video URL       | URL                           | Optional; for project hero video             |
| `description`    | Description     | Multi-line text               | Project body copy                            |
| `press_link`     | Press Link      | URL                           | Optional; link to press coverage             |
| `featured`       | Featured        | True or false (boolean)       | Controls homepage carousel inclusion         |

### 1.2 Press Accolade

- **Type name:** `press_accolade`
- **Display name:** Press Accolade
- **Access:** Storefronts
- **Display name field:** `publication`

| Field key      | Display name  | Type             | Validation / Notes              |
|----------------|---------------|------------------|---------------------------------|
| `publication`  | Publication   | Single line text | Set as display name field       |
| `headline`     | Headline      | Single line text | Article headline or quote       |
| `article_url`  | Article URL   | URL              | Link to the published article   |
| `date`         | Date          | Date             | Publication date                |

### 1.3 Team Member

- **Type name:** `team_member`
- **Display name:** Team Member
- **Access:** Storefronts
- **Display name field:** `name`

| Field key    | Display name | Type             | Validation / Notes                  |
|--------------|--------------|------------------|-------------------------------------|
| `name`       | Name         | Single line text | Set as display name field           |
| `role`       | Role         | Single line text | Job title                           |
| `bio`        | Bio          | Multi-line text  | Short biography                     |
| `image`      | Image        | File (image only)| Headshot or portrait                |
| `anchor_id`  | Anchor ID    | Single line text | For smooth-scroll links, e.g. "sarah-peake" |

### 1.4 Career Opening

- **Type name:** `career_opening`
- **Display name:** Career Opening
- **Access:** Storefronts
- **Display name field:** `title`

| Field key       | Display name   | Type             | Validation / Notes                    |
|-----------------|----------------|------------------|---------------------------------------|
| `title`         | Title          | Single line text | Set as display name field             |
| `specification` | Specification  | Rich text        | Full job description with formatting  |
| `is_active`     | Is Active      | True or false    | Only active openings display on site  |

---

## Section 2: Product Metafield Definitions

Create these in **Settings > Custom data > Products > Add definition**.

All definitions use namespace `workshop`. When adding each definition, set the namespace to `workshop` and the key as shown below.

| Namespace.Key                  | Display name        | Type                        | Description / Notes                                                        |
|--------------------------------|---------------------|-----------------------------|---------------------------------------------------------------------------|
| `workshop.tearsheet_pdf`       | Tearsheet PDF       | File (accepts: PDF)         | Downloadable product tearsheet                                             |
| `workshop.secondary_image`     | Secondary Image     | File (accepts: images)      | Alternate product image for hover or detail                                |
| `workshop.room_scheme_images`  | Room Scheme Images  | List of files (images)      | Gallery of room scheme / in-situ photographs                               |
| `workshop.interactive_tags`    | Interactive Tags    | JSON                        | Structure: `[{"x_percent": 45, "y_percent": 30, "label": "Shade", "product_handle": "peridot-pendant"}]` |
| `workshop.video_url`           | Video URL           | URL                         | Product video (e.g. studio-table turntable video)                          |
| `workshop.category`            | Category            | Single line text            | For filtering: "lighting", "rugs", "furniture", "accessories"              |
| `workshop.collection_name`     | Collection Name     | Single line text            | For smart collection conditions: matches collection handle suffix          |

---

## Section 3: Collections

Create these in **Products > Collections**.

### 3.1 Manual Collections (Portfolio)

These are empty route shells. Do NOT add products -- portfolio content comes from `project` metaobjects queried by custom sections in later phases.

| Collection title       | Handle                  | Type   | Template to assign       |
|------------------------|-------------------------|--------|--------------------------|
| Portfolio - All        | `portfolio-all`         | Manual | `collection.portfolio`   |
| Portfolio - Residential| `portfolio-residential` | Manual | `collection.portfolio`   |
| Portfolio - Commercial | `portfolio-commercial`  | Manual | `collection.portfolio`   |
| Portfolio - Hospitality| `portfolio-hospitality` | Manual | `collection.portfolio`   |

**How to assign template:** After creating each collection, scroll down to the "Theme template" dropdown (or find it in the right sidebar under "Online Store") and select `collection.portfolio`.

### 3.2 Smart Collections (Workshop)

| Collection title   | Handle             | Type  | Condition                                                              | Template to assign       |
|--------------------|--------------------|-------|------------------------------------------------------------------------|--------------------------|
| The Workshop       | `workshop-all`     | Smart | Product metafield `workshop.category` is set (or Product type equals "Workshop") | `collection.workshop`    |
| Workshop - Lighting| `workshop-lighting` | Smart | Product metafield `workshop.collection_name` equals `lighting`        | `collection.workshop`    |

**Note:** Additional smart collections can be added later (e.g. "Workshop - Rugs", "Workshop - Furniture") following the same pattern with `workshop.collection_name` equals the relevant value.

**How to create smart collection conditions:**
1. Create collection, choose "Automated" type
2. Add condition: Product metafield > workshop.collection_name > is equal to > `lighting`
3. For "workshop-all": use condition Product metafield > workshop.category > is not empty

---

## Section 4: Template Assignments

### 4.1 Pages

Create these pages if they do not already exist, then assign templates.

| Page               | Location                          | Template to assign   |
|--------------------|-----------------------------------|----------------------|
| Press              | Online Store > Pages > Add page   | `page.press`         |
| Careers            | Online Store > Pages > Add page   | `page.careers`       |
| About (existing)   | Already exists                    | `page.about` (keep)  |
| Contact (existing) | Already exists                    | `page.contact` (keep)|

**How to assign page template:** Edit the page, then in the right sidebar under "Online Store", select the template from the "Theme template" dropdown.

### 4.2 Collections

Already assigned during collection creation (Section 3). Verify:

- All `portfolio-*` collections use `collection.portfolio`
- All `workshop-*` collections use `collection.workshop`

### 4.3 Products

Workshop products should use `product.workshop-item` template. Assign when creating sample products below.

### 4.4 Blog

| Blog/Article       | Location                                  | Template                  |
|--------------------|-------------------------------------------|---------------------------|
| Journal (blog)     | Online Store > Blog posts > Manage blogs  | `blog.journal`            |
| Journal entries    | Individual articles in Journal blog       | `article.journal-entry`   |

**How to create Journal blog:**
1. Go to Online Store > Blog posts
2. Click "Manage blogs" in the top right
3. Add blog named "Journal" (handle: `journal`)
4. When creating articles in this blog, set their template to `article.journal-entry`

### 4.5 Templates already in place (no action needed)

- `index.json` -- Homepage
- `page.about.json` -- About page
- `page.contact.json` -- Contact page

---

## Section 5: Sample Content to Create

Create these entries for development and testing. Use placeholder images where real assets are not yet uploaded.

### 5.1 Project Metaobject Entries

Go to **Content > Metaobjects > Project > Add entry** for each.

#### Project 1: Surrey Arts and Craft Home

- **Title:** Surrey Arts and Craft Home
- **Category:** residential
- **Description:** This Arts and Crafts country house is a bucolic period property that, over the course of two years, was sensitively and comprehensively restored and renovated. In need of significant attention, the house was carefully reconfigured to support the needs of a modern, dynamic family, while a deep respect for the original architecture guided every decision. Studio Peake led the creative direction across the entire project, shaping the aesthetic of each space in close collaboration with a team of architects, lighting designers, and specialist contractors.
- **Hero Image:** Upload placeholder (or real image `studiopeake-surrey-arts-and-craft-interior-sketch`)
- **Gallery Images:** Upload 2-3 placeholder images
- **Featured:** True
- **Status:** Active

#### Project 2: Parsons Green House

- **Title:** Parsons Green House
- **Category:** residential
- **Description:** A young family with a love of clean lines and fresh pattern invited Studio Peake to step in after the structural and architectural phase of their renovation was complete. The house offered a true blank canvas: carefully finished, light filled, and minimal, but lacking warmth and personality. Our brief was to transform it into a layered, welcoming home that could support busy daily life while still feeling calm and considered.
- **Hero Image:** Upload placeholder
- **Gallery Images:** Upload 2-3 placeholder images
- **Featured:** True
- **Status:** Active

#### Project 3: Kensington Townhouse

- **Title:** Kensington Townhouse
- **Category:** residential
- **Description:** Studio Peake was commissioned to bring refined comfort and personality to a beautifully proportioned Kensington townhouse, following an architectural renovation led by Neal Newland of Peek Architecture. With the structure complete, our role focused on elevating the interiors through thoughtful decoration, bespoke furnishings, and subtle architectural additions to create cohesion, warmth, and character.
- **Hero Image:** Upload placeholder
- **Gallery Images:** Upload 2-3 placeholder images
- **Featured:** False
- **Status:** Active

#### Project 4: Glenthorne Studio

- **Title:** Glenthorne Studio
- **Category:** commercial
- **Description:** Housed within a former Victorian bakery, our Hammersmith studio sits in a converted industrial mews at the centre of a lively creative community. The space was sensitively reworked to reflect our values of craft, collaboration, and creativity, while retaining its workshop character and material honesty. Original features were preserved where possible and paired with practical, well made additions to support daily studio life.
- **Hero Image:** Upload placeholder
- **Gallery Images:** Upload 2-3 placeholder images
- **Featured:** False
- **Status:** Active

### 5.2 Team Member Metaobject Entries

Go to **Content > Metaobjects > Team Member > Add entry** for each.

| Name              | Role                          | Anchor ID          | Bio (abbreviated)                                                                                     |
|-------------------|-------------------------------|--------------------|---------------------------------------------------------------------------------------------------------|
| Sarah Peake       | Founder and Creative Director | `sarah-peake`      | Founder Sarah Peake leads a close-knit studio team. She remains closely involved in each project, providing creative leadership and working closely with each client. |
| Sophy Toller      | Head of Design                | `sophy-toller`     | Sophy has worked alongside Sarah since the early days of Studio Peake.                                  |
| Dido Connelly     | Senior Designer               | `dido-connelly`    | Senior Designer at Studio Peake.                                                                        |
| Tilly Lasseter    | Senior Designer               | `tilly-lasseter`   | Senior Designer at Studio Peake.                                                                        |
| Eliza Alton       | Mid Level Designer            | `eliza-alton`      | Mid Level Designer at Studio Peake.                                                                     |
| Louka Panayides   | Mid Level Designer            | `louka-panayides`  | Mid Level Designer at Studio Peake.                                                                     |
| Gita Vadukul      | Junior Designer               | `gita-vadukul`     | Junior Designer at Studio Peake.                                                                        |
| Bella Abrey       | Studio Manager                | `bella-abrey`      | Studio Manager at Studio Peake.                                                                         |

- **Image:** Upload placeholder headshot for each (or leave blank for now)
- **Status:** Active for all entries

### 5.3 Workshop Products

Go to **Products > Add product** for each. Set Product type to "Workshop" and assign template `product.workshop-item`.

#### Product 1: The Elowen Chandelier

- **Title:** The Elowen Chandelier
- **Description:** The Elowen is a beautiful, handcrafted chandelier inspired by the natural twist and weave of the elm tree. It is an engaging, vivid centrepiece for any room. Created in collaboration with decorative artist Pierre-Yves Morel.
- **Product type:** Workshop
- **Images:** Upload 1-2 placeholder images
- **Template:** `product.workshop-item`
- **Metafields to set:**
  - `workshop.category`: lighting
  - `workshop.collection_name`: lighting

#### Product 2: The Studio Table

- **Title:** The Studio Table
- **Description:** A 60mm honed marble slab rests on an oiled oak plinth, expressing both the solidity and fluid movement of stone. Developed in close collaboration with Porter Studios.
- **Product type:** Workshop
- **Images:** Upload 1-2 placeholder images
- **Template:** `product.workshop-item`
- **Metafields to set:**
  - `workshop.category`: furniture
  - `workshop.collection_name`: furniture

#### Product 3: The Elements Rug in Brown

- **Title:** The Elements Rug in Brown
- **Description:** The Element Rug Collection is an experiment in colour and contrast, exploring the connection between asymmetry and structure, construction and composition, and the tensions inherent in colour. Inspired by De Stijl artists and architects.
- **Product type:** Workshop
- **Images:** Upload 1-2 placeholder images
- **Template:** `product.workshop-item`
- **Metafields to set:**
  - `workshop.category`: rugs
  - `workshop.collection_name`: rugs

#### Product 4: Peridot Pendant

- **Title:** Peridot Pendant
- **Description:** Building on the Peridot lamp series, the Peridot Pendant is a new design by Sarah Peake in collaboration with Rupert Merton. Hand thrown ceramic elements, formed from varied organic shapes, are each entirely unique.
- **Product type:** Workshop
- **Images:** Upload 1-2 placeholder images
- **Template:** `product.workshop-item`
- **Metafields to set:**
  - `workshop.category`: lighting
  - `workshop.collection_name`: lighting

#### Product 5: Antique Candles

- **Title:** Antique Candles
- **Description:** Each candle is hand-poured into a one-of-a-kind vintage vessel, each carefully sourced by Sarah Peake and the Studio Peake team for its character and charm. By giving these beautiful pieces a new lease of life, we celebrate sustainability.
- **Product type:** Workshop
- **Images:** Upload 1-2 placeholder images
- **Template:** `product.workshop-item`
- **Metafields to set:**
  - `workshop.category`: accessories
  - `workshop.collection_name`: accessories

**How to set product metafields:** When editing a product, scroll to the bottom of the product page. The metafield definitions created in Section 2 will appear as editable fields under the "Workshop" namespace.

### 5.4 Press Accolade Entries (Placeholder)

Go to **Content > Metaobjects > Press Accolade > Add entry** for each.

| Publication           | Headline                                          | Article URL                    | Date       |
|-----------------------|---------------------------------------------------|--------------------------------|------------|
| House & Garden        | Studio Peake's Surrey Arts and Crafts Restoration  | https://example.com/placeholder | 2025-06-15 |
| Architectural Digest  | The Rise of Collaborative Interior Design          | https://example.com/placeholder | 2025-03-01 |
| Elle Decoration       | London's Most Exciting Design Studios              | https://example.com/placeholder | 2024-11-20 |

- **Status:** Active for all entries

### 5.5 Career Opening Entries (Placeholder)

Go to **Content > Metaobjects > Career Opening > Add entry** for each.

| Title                    | Specification (rich text)                                                  | Is Active |
|--------------------------|----------------------------------------------------------------------------|-----------|
| Mid Level Interior Designer | We are looking for a talented mid level designer to join our team. 3+ years experience in residential interior design required. Strong sketching and presentation skills essential. | True      |
| Design Intern (Summer 2026) | A paid summer internship opportunity for architecture or interior design students. Hands-on experience across live projects. Start date: June 2026. | True      |

---

## Section 6: Verification Checklist

After completing all the above, verify:

- [ ] **Metaobject types (4):** project, press_accolade, team_member, career_opening all visible in Settings > Custom data > Metaobjects
- [ ] **Product metafield definitions (7):** All 7 workshop.* fields visible in Settings > Custom data > Products
- [ ] **Collections (6):** portfolio-all, portfolio-residential, portfolio-commercial, portfolio-hospitality, workshop-all, workshop-lighting all exist with correct templates
- [ ] **Pages:** Press and Careers pages exist with correct templates assigned
- [ ] **Blog:** Journal blog exists; at least one test article with `article.journal-entry` template
- [ ] **Sample project entries (4):** Visible in Content > Metaobjects > Project, all Active
- [ ] **Sample team members (8):** Visible in Content > Metaobjects > Team Member, all Active
- [ ] **Sample workshop products (5):** Visible in Products, all with `product.workshop-item` template and workshop metafields populated
- [ ] **Sample press accolades (3):** Visible in Content > Metaobjects > Press Accolade, all Active
- [ ] **Sample career openings (2):** Visible in Content > Metaobjects > Career Opening, all Active
- [ ] **Customiser test:** Open any portfolio collection in the Customiser -- should load with `collection.portfolio` template
- [ ] **Customiser test:** Open any workshop product in the Customiser -- should load with `product.workshop-item` template
- [ ] **Dynamic source test:** In the Customiser, add a section with dynamic source, confirm Project metaobject fields appear as available sources
