# Reusable Templates (Mixins) & Cascading Precedence

When managing servers with dozens or hundreds of blueprints, retyping the same pricing, visual themes, lore cards, and durability rules for every single recipe introduces configuration bloat and maintenance errors.

CraftingBlueprints features an object-oriented **Template Composition Engine** (Mixins) that allows server administrators to define modular template blocks once and compose them across multiple blueprints.

---

## 1. Defining Reusable Templates (`templates:`)

Templates are non-instantiated blueprint modules declared under the root `templates:` section of any YAML file in `plugins/CraftingBlueprints/blueprints/`:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
templates:
  # Module 1: Visual styling for ancient magic scrolls
  visual_ancient_scroll:
    item:
      material: PAPER
      custom_model_data: 1001
      glowing: true
    map:
      theme: parchment_aged
      frame: runic
      badge: crafting

  # Module 2: Visual styling for legendary forge relics
  visual_legendary_relic:
    item:
      material: FILLED_MAP
      glowing: true
    map:
      theme: forge
      frame: rosette
      badge: smithing
      item_outline:
        enabled: true
        width: 2
        color: "rainbow"

  # Module 3: Economy pricing tier (Epic)
  economy_tier_epic:
    price: 15000.0
    sell_price: 3750.0
    extra:
      tier: "EPIC"
      currency: "VAULT"

  # Module 4: 3-Craft durability limit mixin
  usage_three_crafts:
    permanent: false
    time: 0
    uses: 3

  # Module 5: Permanent unlimited usage mixin
  usage_permanent:
    permanent: true
    time: 0
    uses: 0
```

---

## 2. Composing Templates on Blueprints

To apply templates to a blueprint, list their IDs under `templates:` (or single string `template:`):

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  titan_greatsword:
    blueprint: NETHERITE_SWORD
    name: "<gradient:#FF0000:#FFAA00><bold>Titan Greatsword Blueprint</bold></gradient>"

    # Multi-template mixin composition
    templates:
      - visual_legendary_relic
      - economy_tier_epic
      - usage_three_crafts

    # Specific local override (Blueprint overrides Template 3):
    uses: 5
```

---

## 3. Mixin Inheritance Precedence Rules

When a blueprint inherits multiple templates, CraftingBlueprints resolves configurations using strict cascading precedence:

```text
Parent Defaults -> Folder Defaults -> File Defaults -> Template 1 -> Template 2 -> Blueprint Local Config
```

```
                ┌──────────────────────────────────────────────┐
                │        1. Inherited Folder Defaults          │
                │        (From root blueprints/ downward)      │
                └──────────────────────┬───────────────────────┘
                                       ▼
                ┌──────────────────────────────────────────────┐
                │        2. Current Folder default:            │
                └──────────────────────┬───────────────────────┘
                                       ▼
                ┌──────────────────────────────────────────────┐
                │        3. Current File file_default:         │
                └──────────────────────┬───────────────────────┘
                                       ▼
                ┌──────────────────────────────────────────────┐
                │        4. Template 1 (First Mixin)           │
                └──────────────────────┬───────────────────────┘
                                       ▼
                ┌──────────────────────────────────────────────┐
                │        5. Template 2 (Second Mixin)          │
                │            (Overrides Template 1)            │
                └──────────────────────┬───────────────────────┘
                                       ▼
                ┌──────────────────────────────────────────────┐
                │        6. Blueprint Local Configuration      │
                │             (HIGHEST PRECEDENCE)             │
                └──────────────────────┬───────────────────────┘
                                       ▼
                ┌──────────────────────────────────────────────┐
                │            Final Merged Blueprint            │
                └──────────────────────────────────────────────┘
```

### Precedence Invariants:
1. **Blueprint Local Wins**: Any property defined explicitly on the blueprint itself (e.g. `uses: 5`, `price: 25000.0`, or local `name:`) **always takes absolute precedence** over all templates and defaults.
2. **Template Order (Right Overrides Left)**: If `Template 1` defines `price: 10000.0` and `Template 2` defines `price: 15000.0`, `Template 2` wins because it is evaluated later in the list:
   `Blueprint Local > Template 2 > Template 1`.
3. **Dictionaries & Maps (`item:`, `map:`, `extra:`)**: Deep-merged recursively. If `Template 1` sets `item.material: FILLED_MAP` and `Template 2` sets `item.glowing: true`, the resulting item will have **both** `material: FILLED_MAP` and `glowing: true`.
4. **Lists (`lore:`, `blueprints:`, `pool:`)**: Replaced entirely by the latest non-empty list declared in the cascade.
5. **Scalars (`name:`, `price:`, `permanent:`, `uses:`, `time:`)**: Overwritten by the latest declared non-null scalar.

---

## 4. Hierarchical Lexical Scoping

Templates are not flat global variables; they follow downward directory scoping:

1. **Global Templates (Root Scope)**:
   Any template declared in a YAML file at the root of `plugins/CraftingBlueprints/blueprints/` (e.g. `blueprints/00_templates.yml`) is **globally visible** to all blueprints across all folders and subfolders.
2. **Folder-Scoped Templates**:
   A template declared in `blueprints/weapons/templates.yml` is visible **only** to files inside `blueprints/weapons/` and its subdirectories (e.g. `weapons/swords/`, `weapons/axes/`). It cannot be accessed by `armor/` or root files.
3. **Template Shadowing (Nearest-Ancestor)**:
   If a template named `tier_epic` is declared at both the root level and inside `weapons/`, blueprints in `weapons/` will inherit the local `weapons/tier_epic` definition.

---

## 5. Folder & File Defaults (`default:` & `file_default:`)

To apply settings across an entire folder without repeatedly typing `templates:` on every item, use defaults:

```yaml
# Inside blueprints/weapons/swords.yml

# File-Level Default: applies to all blueprints in this file
file_default:
  price: 7500.0
  item:
    material: FILLED_MAP
    glowing: true
  map:
    theme: technical
    frame: bracket

singles:
  iron_blade:
    blueprint: IRON_SWORD
    name: "<white>Iron Blade</white>"
    # Automatically inherits price: 7500.0 and technical map theme!

  diamond_blade:
    blueprint: DIAMOND_SWORD
    name: "<aqua>Diamond Blade</aqua>"
    price: 15000.0 # Overrides the file default price
```

### Cutting Off Inheritance (`inherit: false`)
If you have an isolated file (such as admin event items) and want to discard all inherited folder defaults:

```yaml
file_default:
  inherit: false    # Discards all ancestor folder defaults; starts from clean slate
  price: 0.0
  extra:
    category: "admin_only"
```
