# Declarative YAML Blueprint Authoring

All blueprints in CraftingBlueprints are authored declaratively in YAML files placed inside `plugins/CraftingBlueprints/blueprints/`. The plugin recursively scans this directory and all nested subdirectories (e.g. `weapons/`, `armor/`, `potions/`) in deterministic alphabetical order.

---

## Authoritative JSON Schema & IDE IntelliSense

To eliminate syntax errors, typo-induced bugs, and cognitive overload, CraftingBlueprints provides an authoritative JSON Schema (`blueprint.schema.json`).

To enable real-time autocompletion, field descriptions, and instant error highlighting in Visual Studio Code or IntelliJ IDEA, add this directive as the very first line of any blueprint YAML file:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
```

---

## Anatomy of a Production Blueprint

Below is an exhaustive, production-ready blueprint configuration demonstrating every canonical property and sub-block:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  ancient_netherite_axe:
    # 1. Target Recipe to Unlock (Material, Custom Item, Potion, or Enchantment)
    blueprint: NETHERITE_AXE
    name: "<gradient:#FF5555:#FFAA00><bold>Ancient Netherite Battleaxe</bold></gradient>"

    # 2. Reusable Template Mixins (Optional)
    templates:
      - visual_legendary_relic
      - economy_tier_legendary

    # 3. Durability & Expiration Limits
    permanent: false
    time: 86400           # Duration in seconds (or human format '24h', '7d'). 0 = no time limit
    uses: 10              # Maximum craft count before the blueprint expires. 0 = unlimited

    # 4. Vault Economy Integration
    price: 15000.0        # Purchase price in catalog (/cb item list) and /cb buy
    sell_price: 3750.0    # Refund value when selling back to the catalog

    # 5. In-Game Physical Item Representation
    item:
      material: FILLED_MAP     # FILLED_MAP, PAPER, BOOK, NETHER_STAR, etc.
      custom_model_data: 2004  # CustomModelData integer for resource pack models
      glowing: true            # Enchantment shimmer sheen without lore clutter

    # 6. Map Visual Drafting Aesthetics (Active when material is FILLED_MAP)
    map:
      theme: forge             # Procedural theme or image in images/backgrounds/
      frame: rosette           # Corner architecture: bracket, chamfer, diamond, runic, rosette, star, none
      badge: smithing          # Workstation badge: crafting, anvil, brewing, smithing, furnace, none
      icon_scale: 2            # Integer scale (1 to 4) using sharp nearest-neighbor interpolation
      drop_shadow: true        # Subtle 2px ambient occlusion drop shadow behind item sprite
      item_outline:
        enabled: true
        width: 2               # Continuous contour outline width in pixels (1 to 8)
        color: "rainbow"       # 'rainbow', hex '#ffd700', or gradient
        opacity: 100           # Opacity percentage (1 to 100)

    # 7. MiniMessage Lore Description Card
    lore:
      - "<dark_gray><strikethrough>-----------------------------</strikethrough></dark_gray>"
      - "<gray>Target Equipment:</gray> <white>{target_item}</white>"
      - "<gray>Remaining Forges:</gray> <yellow><bold>{uses} / 10</bold></yellow>"
      - "<gray>Licensing Time:</gray> <aqua>{time}</aqua>"
      - "<dark_gray><strikethrough>-----------------------------</strikethrough></dark_gray>"
      - "<yellow>Catalog Price:</yellow> <green>${price}</green>"
      - "<yellow>Scrap Value:</yellow> <gold>${sell_price}</gold>"
      - "<dark_gray><strikethrough>-----------------------------</strikethrough></dark_gray>"
      - "<dark_gray>Hold map in hand and Right-Click to memorize.</dark_gray>"

    # 8. Extensible Metadata Block (Custom Scripts & Hooks)
    extra:
      tier: "MYTHIC"
      category: "HEAVY_WEAPONS"
      tradeable: false
```

---

## Complete Property Reference Table

| Key | Type | Required? | Default | Description & Accepted Values |
| :--- | :--- | :--- | :--- | :--- |
| `blueprint` | String | **Yes** | — | Target Bukkit `Material` (e.g. `NETHERITE_SWORD`), `PotionType` (`SPEED`), `Enchantment` (`MENDING`), or custom item identifier (`ia:...`, `nexo:...`, `oraxen:...`). |
| `name` | String | No | Formatted Target | Display name supporting MiniMessage tags and gradients (`<gradient:#HEX1:#HEX2>`). |
| `permanent` | Boolean | No | `true` | If `true`, the blueprint remains unlocked indefinitely. |
| `time` | Integer / String | No | `0` | Expiration countdown. Accepts raw seconds (`86400`) or human durations (`45s`, `30m`, `12h`, `7d`). `0` = no time expiration. |
| `uses` | Integer | No | `0` | Maximum craft count allowed before the blueprint expires. `0` = unlimited crafts. |
| `price` | Double | No | `0.0` | Vault purchase price when bought from `/cb item list` catalog. |
| `sell_price` | Double | No | `0.0` | Vault currency refunded when selling back via the catalog. |
| `templates` / `template` | List / String | No | `[]` | List of reusable template mixin IDs inherited by this blueprint. |
| `item.material` | String | No | `FILLED_MAP` | Bukkit Material used when giving the physical blueprint item to a player. |
| `item.custom_model_data` | Integer | No | `0` | CustomModelData integer tag for resource pack model overrides. |
| `item.glowing` | Boolean | No | `false` | Adds visual enchantment shimmer without showing enchantment lore. |
| `map.enabled` | Boolean | No | `true` | Controls whether the 128x128 map drafting renderer is active for this item. |
| `map.theme` | String | No | `technical` | Base background theme (`technical`, `antique`, `forge`, `royal`, `runic`, `dark`, `rainbow`) or PNG filename in `images/backgrounds/`. |
| `map.frame` | String | No | `bracket` | Corner geometry frame: `bracket`, `chamfer`, `diamond`, `runic`, `rosette`, `star`, or `none`. |
| `map.badge` | String | No | Auto-detected | Top-left workstation badge: `crafting`, `anvil`, `brewing`, `smithing`, `furnace`, or `none`. |
| `map.icon_scale` | Integer | No | `2` | Central item sprite scale factor (`1` to `4`) using pixel-art nearest-neighbor scaling. |
| `map.drop_shadow` | Boolean | No | `true` | Renders a subtle 2px ambient occlusion drop shadow behind the central sprite. |
| `map.item_outline.enabled` | Boolean | No | `false` | Enables procedural contour outline around the central item sprite. |
| `map.item_outline.width` | Integer | No | `2` | Outline thickness in pixels (`1` to `8`). |
| `map.item_outline.color` | String | No | `rainbow` | Outline color: `rainbow`, hex `#RRGGBB`, or gradient string. |
| `map.title.show` | Boolean | No | `true` | Controls rendering of the bottom typography plaque banner. |
| `map.title.text` | String | No | `%bname%` | Custom title banner text. Supports `%blueprint_name%` and `%bname%`. |
| `map.stamp.show` | Boolean | No | `true` | Controls rendering of the top-right authentication wax seal stamp. |
| `map.stamp.style` | String | No | Auto | Seal style: `wax_seal`, `clock`, `box`, `plaque`, or `none`. |
| `lore` | List<String> | No | `[]` | List of MiniMessage lore lines supporting dynamic context placeholders. |
| `extra` | Map | No | `{}` | Extensible key-value metadata block accessible to scripts, quests, and third-party plugins. |

---

## File Organization & Lexical Scope

You can organize your YAML files into any directory hierarchy inside `plugins/CraftingBlueprints/blueprints/`:

```text
plugins/CraftingBlueprints/blueprints/
├── 00_templates.yml           # Global templates (visible to all directories)
├── weapons/
│   ├── swords.yml             # Single blueprints
│   ├── axes.yml
│   └── legendary/
│       └── mythic_blades.yml
├── armor/
│   ├── sets.yml               # Package blueprints (full sets)
│   └── shields.yml
└── consumables/
    ├── potions.yml            # Alchemy brewing blueprints
    └── enchanted_books.yml    # Anvil enchantment blueprints
```

### 1. Deterministic First-Win ID Collision Rule
If two blueprints in different files (or within the same file) declare the identical lowercase ID (e.g. `starter_sword` in both `weapons/swords.yml` and `kits/beginner.yml`):
* The **first file encountered** during alphabetical directory traversal wins and registers the blueprint.
* The duplicate definition is ignored, and a warning is printed to the console:
  ```text
  [CraftingBlueprints] Duplicate blueprint ID 'starter_sword' in 'kits/beginner.yml' ignored: already defined in 'weapons/swords.yml'.
  ```

### 2. Atomic Fail-Safe on Syntax Errors
* If any YAML file contains malformed syntax (unbalanced quotes, illegal tab indentation, broken blocks), the reload process triggers an **immediate atomic abort**.
* **Zero Database Modifications**: No blueprints are inserted, updated, or pruned.
* The previous working database state remains 100% intact, protecting your live server from broken configurations.

### 3. Non-Fatal Version Skipping
* If a blueprint specifies an item, material, or recipe that does not exist on your server version (e.g. `MACE` or `WIND_CHARGE` on Paper 1.20.4), the plugin **safely skips** that individual item without aborting the reload or deleting existing records. All other valid blueprints in the file load normally.

---

## Dry-Run Validation (`/cb validate`)

Always verify your files before or after editing:

```text
/cb validate
```

The validator performs comprehensive linting:
* Verifies Bukkit material, potion, and enchantment identifiers against the active server version.
* Validates hex colors and named color palette references.
* Detects circular dependencies and unresolved template references.
* Emits helpful "Did you mean?" suggestions for minor typos (e.g. `roseta` -> `rosette`).
