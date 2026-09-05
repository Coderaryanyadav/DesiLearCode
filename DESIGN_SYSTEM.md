# DesiLearCode — 2026 Product Design System

## 1. Design Philosophy

DesiLearCode is **technology infrastructure for social opportunity**. It bridges
hardware donation, volunteer mentorship, and verified child-care organizations
across India.

### Anti-Patterns Strictly Prohibited:

- **No AI Template Archetypes:** No floating purple/blue gradient orbs, no
  generic 3-card copy-paste layouts, no arbitrary `rounded-3xl` bubble cards, no
  meaningless statistics or fake beneficiary photos.
- **No Generic SaaS Clichés:** Avoid vague copy like _"Empowering communities
  through digital transformation"_. Use concrete technical copy: _"Refurbish,
  verify, and deploy idle computing hardware to grassroots learning labs."_
- **No Unnecessary Shadows:** Surfaces gain visual hierarchy through borders,
  surface contrast, and crisp spacing, not diffuse box-shadows.

---

## 2. Color System & Tokens

### Neutrals (Structure & Substrate)

- **Background (`--background`)**: `#fbfbf9` (Daylight off-white, reduces glare)
- **Foreground (`--foreground`)**: `#0f141c` (Deep carbon ink)
- **Surface (`--surface`)**: `#ffffff` (Clean white layer)
- **Surface Hover (`--surface-hover`)**: `#f5f6f8`
- **Surface Subtle (`--surface-subtle`)**: `#f0f1f4`
- **Border (`--border`)**: `#e2e4e9` (Crisp 1px dividing lines)
- **Border Muted (`--border-muted`)**: `#eceef2`
- **Muted Text (`--muted`)**: `#576071` (High contrast WCAG AAA legible)

### Functional Accents

- **Primary (Engineering Blue)**: `primary-500: #0e8ee4`,
  `primary-600: #0270c2`, `primary-900: #0c406d`
- **Accent (Warm Amber/Ochre)**: `accent-500: #d97706`, `accent-600: #b45309`
  (Represents human connection & craft)
- **Success (Verified Green)**: `success-500: #10b981`, `success-600: #059669`
- **Warning (Pending State)**: `warning-500: #f59e0b`, `warning-600: #d97706`
- **Error (Critical State)**: `error-500: #ef4444`, `error-600: #dc2626`

---

## 3. Typography Scale & Hierarchy

DesiLearCode uses **Inter** paired with structured monospace metadata numerals
and status indicators.

| Level              | Size          | Weight  | Tracking   | Usage                                                |
| :----------------- | :------------ | :------ | :--------- | :--------------------------------------------------- |
| **Display 1**      | `48px - 64px` | 800     | `-0.035em` | Hero mission statements                              |
| **Heading 1**      | `32px - 40px` | 700     | `-0.025em` | Page & section anchors                               |
| **Heading 2**      | `24px - 28px` | 700     | `-0.02em`  | Section headers, card titles                         |
| **Heading 3**      | `18px - 20px` | 600     | `-0.015em` | Drawer headings, modal titles                        |
| **Body Large**     | `16px - 18px` | 400/500 | `-0.01em`  | Lead paragraphs                                      |
| **Body Regular**   | `14px - 15px` | 400/500 | `-0.005em` | General content, table cells                         |
| **Caption / Mono** | `11px - 13px` | 500/600 | `+0.02em`  | Tracking IDs (`#DL-XXXX`), timestamps, status badges |

---

## 4. Spacing Scale & Content Rhythm

- **Atomic Spacing**: `4px (1)`, `8px (2)`, `12px (3)`, `16px (4)`, `24px (6)`,
  `32px (8)`, `48px (12)`, `64px (16)`
- **Content Max Widths**:
  - Public Editorial Pages: `max-w-7xl` (`1280px`) with `px-4 sm:px-6 lg:px-8`
  - Operational Dashboards: `max-w-7xl` or full-width data grids with fixed
    action drawers
  - Focused Forms: `max-w-2xl` (`672px`) or multi-step segmented cards

---

## 5. Radius & Elevation Discipline

- **Controls (Buttons, Inputs, Badges)**: `rounded-md` (`6px`) or `rounded-lg`
  (`8px`)
- **Standard Cards & Panels**: `rounded-xl` (`12px`) with `border border-border`
- **Major Hero / Modal Enclosures**: `rounded-2xl` (`16px`)
- **Elevation**:
  - Default surfaces: Flat with `border border-border`
  - Interactive Hover: `shadow-panel border-borderMuted`
  - Drawers / Modals: `shadow-overlay`

---

## 6. Component Archetypes & Patterns

### 1. Project Presentation Suite

- **`FeaturedProjectCard`**: Editorial layout featuring problem statement,
  target students, itemized resource list, funding progress bar, and direct
  support action.
- **`ProjectCard`**: Standard grid layout with clear category tags, verification
  badges, and milestone count.
- **`ProjectListRow`**: Dense table/row layout for search listings and admin
  management.
- **`ProjectImpactCard`**: Outcome-focused summary showing verified student
  cohorts and deployed hardware.

### 2. Device Logistics Engine

- **Stepped Intake**: Step 1 (Device Specs) &rarr; Step 2 (Condition) &rarr;
  Step 3 (Handover Method) &rarr; Step 4 (NIST 800-88 Data Sanitization Pledge)
  &rarr; Step 5 (Confirmation & Tracking ID `#DL-XXXX`).
- **Vertical Logistics Timeline**: Connected state nodes (`SUBMITTED` &rarr;
  `INSPECTION` &rarr; `WIPED` &rarr; `ASSIGNED` &rarr; `DELIVERED`).

### 3. Operational Dashboards (NGO & Admin)

- **Command Center Hierarchy**:
  1. Priority Review Queue (_"3 actions need attention"_)
  2. Operational Health Bar (_Active Projects, Device Queue, Volunteer Reviews_)
  3. Dense Data Tables with sticky headers, column sorting, search, and action
     menus
  4. Real-time Audit Trail

---

## 7. Accessibility & Safeguarding Standards

- **WCAG 2.1 AA Compliance**: Minimum 4.5:1 text contrast ratio on all
  interactive controls.
- **Child Safeguarding Charter**: Strict Zero-PII rule. No minor names, facial
  photography, or exact school addresses are displayed publicly. All beneficiary
  data is aggregated at the institutional cohort level.
- **Reduced Motion**: Respects `prefers-reduced-motion` across all
  micro-interactions.
