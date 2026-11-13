# Blueprint Configuration (YAML)

All blueprints in CraftingBlueprints are defined declaratively in YAML files placed inside the `plugins/CraftingBlueprints/blueprints/` directory.

The plugin supports hot-reloading (`/cb reload blueprints`), automated file watching, and instant schema validation (`/cb validate`).

---

## Blueprint Anatomy

Below is a complete specification of a single blueprint entry:

```yaml
singles:
  ancient_netherite_axe:
    # 1. Target Recipe / Material
    blueprint: NETHERITE_AXE
    name: "<gradient:#FF5555:#FFAA00><bold>Ancient Netherite Battleaxe</bold></gradient>"

    # 2. Reusable Templates (Mixins)
    templates:
      - visual_legendary_relic
      - economy_legendary_tier

    # 3. Usage & Expiration Limits
    permanent: false
    time: 86400      # 24 hours validity (in seconds), 0 = unlimited
    uses: 10         # Craftable 10 times, 0 = unlimited

    # 4. Economy & Trading
    price: 15000.0   # Purchase price in shop / GUI
    sell_price: 3500.0

    # 5. In-Game Physical Item Representation
    item:
      material: FILLED_MAP     # FILLED_MAP or any item like PAPER, BOOK, NETHER_STAR
      custom_model_data: 2004
      glowing: true

    # 6. Map Visual Rendering (Optional)
    rendering:
      background: "texture_dwarven_magma" # Built-in background image
      tier: "MYTHIC"                      # COMMON, UNCOMMON, RARE, EPIC, MYTHIC
      show_ingredients: true
      guilloche_border: true

    # 7. Lore & Formatting (Supports MiniMessage)
    lore:
      - "<gray>Target Equipment:</gray> <white>{blueprint_target}</white>"
      - "<gray>Remaining Uses:</gray> <yellow>{uses}</yellow>"
      - ""
      - "<dark_gray>Unlock this schematic to forge ancient battleaxes.</dark_gray>"

    # 8. Extensible Metadata
    extra:
      tier: "LEGENDARY"
      tradeable: true
      required_permission: "craftingblueprints.tier.mythic"
```

---

## Configuration Properties Reference

### Target & Identification
* **`blueprint`** *(Required, String)*: The target item or recipe material (e.g. `DIAMOND_SWORD`, `BOW`, `GOLDEN_APPLE`, or custom item IDs).
* **`name`** *(String)*: Display name rendered in tooltips, chat, and GUIs. Fully supports **MiniMessage** gradient, hex color, and bold tags.

### Usability & Expiration
* **`permanent`** *(Boolean)*: If `true`, once learned, the recipe never expires.
* **`time`** *(Integer)*: Duration in seconds for which the blueprint remains valid after unlocking. Set to `0` for no time limit.
* **`uses`** *(Integer)*: Maximum number of times the player can craft this item before the blueprint expires. Set to `0` for infinite uses.

### Physical Item Representation
* **`item.material`** *(String)*: Bukkit `Material` used when giving the blueprint physically (e.g., `FILLED_MAP`, `PAPER`, `BOOK`).
* **`item.custom_model_data`** *(Integer)*: CustomModelData integer tag for custom resource packs (OptiFine / ItemsAdder / Oraxen compatible).
* **`item.glowing`** *(Boolean)*: Enables the enchantment glint effect without displaying enchantment lore.

---

## Dry-Run Validation (`/cb validate`)

Before deploying new blueprints to a live production server, run:

```text
/cb validate
```

CraftingBlueprints inspects all YAML files in `blueprints/`, verifying materials, checking recipe existence, validating template inheritance, and warning against syntax errors before applying changes.
