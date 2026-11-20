!!! important "CraftingBlueprints Extended Exclusive Feature"
    The technical drafting engine, procedural Guilloché frames, custom background textures, status stamps, and gradient typography described on this page require **CraftingBlueprints Extended**. On the Standard Edition, blueprints function as standard physical items without custom map graphics.

# Frames, Rosettes, Seals & Status Stamps

The architectural border (Layer 5) and status stamp (Layer 7) frame the blueprint and authenticate its in-game legitimacy. CraftingBlueprints Extended provides **modular geometric corner frames**, **banknote-grade Guilloché vector rosettes**, and an **authentication status stamp engine**.

---

## Corner Architectural Geometry (`frame`)

Frames establish the structure of the schematic. Configured via `map.frame`, the engine renders precision corner ornaments and border insets:

```
┌───────┐                                                       ┌───────┐
│Bracket│ Hairline L-bracket with vertex stud (Industrial SMP)  │Chamfer│ 45° chamfered notch (Exploration)
└───────┘                                                       └───────┘
┌───────┐                                                       ┌───────┐
│Diamond│ Precision rhombus jewel stud (Prestige Gear)          │ Runic │ Gothic alchemical relief (Arcane Magic)
└───────┘                                                       └───────┘
┌───────┐                                                       ┌───────┐
│Rosette│ Currency-grade Guilloché rosette (Imperial Sovereign) │ Star  │ 4-point nexus star + Iridescent rail (Mythic)
└───────┘                                                       └───────┘
```

| Frame Style | Inset & Linework | Architectural Description | Default Palette |
| :--- | :--- | :--- | :--- |
| `bracket` | 2px hairline rule, 3px inset | Utilitarian L-bracket with a single 1px corner vertex stud. Clean, minimalist drafting look. | Brushed Steel (`#94a3b8`) |
| `chamfer` | Single clean 45° cut | Precision angled corner cut eliminating harsh right angles. Classic engineering blueprint style. | Verdigris Emerald (`#34d399`) |
| `diamond` | Fine single rule + stud | Elegant border featuring a faceted diamond rhombus stud nestled in each corner. | Lapis Sapphire (`#60a5fa`) |
| `runic` | Gothic apex relief | Alchemical lozenge notch with apex relief inspired by ancient spell grimoires. | Void Amethyst (`#c084fc`) |
| `rosette` | Intricate vector rosette | Banknote-grade twin Guilloché rosettes in the top corners with corner jewel studs. | 24k Imperial Gold (`#facc15`) |
| `star` | 4-point nexus star | Radiant 4-point starlight nexus stars in top corners with a continuous bottom rail. | Prismatic Cyan (`#22d3ee`) |
| `none` | No border | Completely borderless canvas for panoramic custom art. | N/A |

### Asymmetric Pedestal Rail Architecture
In ornate styles (`rosette`, `star`, `runic`), the lower border ($y \ge 96$) does not leave isolated corner brackets. Instead, the border extends continuously along the bottom edge, forming an integrated **architectural pedestal rail** that structurally supports the title nameplate banner without clipping or visual clutter.

---

## Banknote-Grade Guilloché Vector Rosettes

On high-tier schematics, CraftingBlueprints Extended renders parametric vector rosettes modeled after security engraving on national banknotes and stock certificates:

$$x(t) = (R - r)\cos(t) + d\cos\left(\frac{R - r}{r} t\right), \quad y(t) = (R - r)\sin(t) - d\sin\left(\frac{R - r}{r} t\right)$$

- **Parametric Precision**: Continuous mathematical curves generate interwoven ribbons that render with microsecond efficiency on the async compositor.
- **Continuous Perimeter Gradients**: Border rules support multi-stop color transitions (`map.frame_color: "gradient:#00AAFF:#00FFAA"` or `"rainbow"`).

---

## Authentication Status Stamps Catalog (`stamp`)

Status stamps (Layer 7) are anchored in the top-right corner, immediately communicating the blueprint's durability mode:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Authentication Status Stamps                         │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ 1. Wax Seal       │ 2. Clock Capsule  │ 3. Lemniscate Infinity (inf2)  │
│ (wax_seal)        │ (clock)           │ (inf2)                         │
│ Gilded wax seal   │ Formatted duration│ 3D carved wax relief           │
│ with 3D shadow    │ pill with clock   │ permanent lifetime stamp       │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

### 1. Imperial Wax Seal (`wax_seal`)
An authentic, circular pixel-art royal wax seal featuring a double seal border, an embossed center emblem, and a soft 3D ambient drop shadow:

- Configurable text ($\le 4$ characters, e.g. `"ROYAL"`, `"SEAL"`, `"GUILD"`).
- Dynamic color relief: Derives highlights and crease shadows automatically from any hex color.

### 2. Temporal Capsule Stamp (`clock`)
Specifically designed for timed blueprints (`time > 0`):

- **Visual Design**: Sleek rounded stadium capsule badge ($H = 12\text{ px}$) with dark slate backing.
- **Analog Clock Icon**: Displays a miniature $7\times 8$ pixel-art pocket watch with accent hands at 3:00.
- **Formatted Duration**: Automatically formats milliseconds or seconds into human-readable strings (`"24h"`, `"7d"`, `"30m"`).

### 3. Lemniscate Infinity Badge (`inf2`)
The iconic hallmark of permanent blueprints. Permanent blueprints automatically render the `inf2` stamp:

- **Bold 3D Wax Relief ($15\times 7\text{ px}$)**: Wide horizontal aspect ratio with open loop apertures and tangible carved wax depth.
- **Tonal Facet Shading**: The upper facet of the infinity symbol is rendered with a subtle tint of the text color itself (`deriveTopShade`), ensuring crisp contrast without clashing with the outer seal color.
- **Trigger Tokens**: Automatically triggered when `permanent: true`, or explicitly set via `text: "inf2"` or `text: "∞"`.

### 4. Limited Uses Plaque & Box (`uses_seal`, `box`)
For usage-limited blueprints (`uses > 0`):

- Displays remaining charges in high contrast: `+5`, `+3`, `+1`.
- Crisp 1px bordered slate backing with drop shadow for instant legibility at $128 \times 128$.

---

## Custom Positioning & Procedural Outlining

You have full creative control over stamp placement and contour framing:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  royal_paladin_blade:
    blueprint: NETHERITE_SWORD
    name: "<gold><bold>Royal Paladin Blade</bold></gold>"
    permanent: true
    map:
      enabled: true
      theme: "royal"
      frame: rosette
      frame_color: "gold"
      stamp:
        style: "wax_seal"
        text: "inf2"          # Renders 3D infinity lemniscate
        border_color: "gold"
        x: 96                 # Custom horizontal anchor (0..128)
        y: 8                  # Custom vertical anchor (0..128)
        outline:
          enabled: true       # Procedural contour framing
          width: 1            # Thickness in pixels (1..8)
          color: "gold"       # Outline color
          opacity: 0.9        # Base opacity (0.0 to 1.0)
          attenuation: 0.5    # Radial distance falloff
```

### Partial Stamp Inheritance
When you declare a `stamp:` block with only a few properties (e.g. only setting `outline:` or custom `x` / `y` coordinates), CraftingBlueprints **automatically preserves theme preset defaults**:

- Omitted `border_color` strictly inherits your active theme's preset accent color.
- Omitted `style` auto-resolves to `clock` (for timed items), `box` (for use items), or `wax_seal` (for permanent items).
- Omitted `text` auto-resolves to formatted duration, craft count, or `inf2`.
