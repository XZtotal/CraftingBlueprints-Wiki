# YAML Structure & Blueprint Fields

All blueprints are defined in YAML files placed inside `plugins/CraftingBlueprints/blueprints/`. You can organize them into multiple files (e.g. `weapons.yml`, `armor.yml`, `tools.yml`)—the plugin automatically scans and loads all `.yml` files in that folder.

---

## Anatomy of a Single Blueprint

Here is a complete, production-ready blueprint entry with all available properties:

```yaml
singles:
  ancient_netherite_axe:
    # 1. Target Recipe to unlock
    blueprint: NETHERITE_AXE
    name: "<gradient:#FF5555:#FFAA00><bold>Ancient Battleaxe Blueprint</bold></gradient>"

    # 2. Reusable Templates (Mixins)
    templates:
      - visual_legendary_relic
      - economy_legendary_tier

    # 3. Durability & Usage Limits
    permanent: false
    time: 86400      # Valid for 24 hours (in seconds), 0 = unlimited
    uses: 10         # Can craft 10 times, 0 = unlimited

    # 4. Economy Pricing (Requires Vault)
    price: 15000.0   # Buy price in GUI/shop
    sell_price: 3500.0

    # 5. In-Game Physical Item Representation
    item:
      material: FILLED_MAP     # FILLED_MAP, PAPER, BOOK, NETHER_STAR, etc.
      custom_model_data: 2004  # CustomModelData for resource packs (optional)
      glowing: true            # Enchantment glint effect

    # 6. Map Visual Rendering (Optional)
    rendering:
      background: "texture_dwarven_magma" # Built-in background texture
      tier: "MYTHIC"                      # COMMON, UNCOMMON, RARE, EPIC, MYTHIC
      guilloche_border: true              # Banknote-style Guilloche border
      show_ingredients: true              # Render the 3x3 recipe grid overlay

    # 7. Lore Description (Supports MiniMessage & Placeholders)
    lore:
      - "<gray>Target Equipment:</gray> <white>{blueprint_target}</white>"
      - "<gray>Remaining Uses:</gray> <yellow>{uses}</yellow>"
      - ""
      - "<dark_gray>Unlock this schematic to forge ancient battleaxes.</dark_gray>"

    # 8. Custom Metadata (Extensible)
    extra:
      tier: "LEGENDARY"
      category: "WEAPONS"
      tradeable: true
```

---

## Property Reference Table

| Key | Type | Required? | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `blueprint` | String | **Yes** | — | Target Bukkit `Material` (e.g. `DIAMOND_SWORD`, `BOW`) or custom item ID. |
| `name` | String | No | Formatted Material | Display name in chat, GUIs, and item tooltips. |
| `permanent` | Boolean | No | `true` | If `true`, the unlocked recipe never expires. |
| `time` | Integer | No | `0` | Expiration countdown in seconds after unlocking (`0` = no time limit). |
| `uses` | Integer | No | `0` | Maximum craft count allowed before the blueprint expires (`0` = unlimited). |
| `price` | Double | No | `0.0` | Cost to buy the blueprint via GUI catalog or economy shop. |
| `sell_price` | Double | No | `0.0` | Value received when selling the blueprint via economy shop. |
| `item.material` | String | No | `FILLED_MAP` | Bukkit item used when giving the blueprint physically to a player. |
| `item.custom_model_data` | Integer | No | `0` | CustomModelData integer tag for custom resource pack models. |
| `item.glowing` | Boolean | No | `false` | Adds visual enchantment sheen without showing enchantment lore. |
| `rendering.background` | String | No | `default` | Background texture ID for map schematics. |
| `rendering.tier` | String | No | `COMMON` | Visual rarity tier (`COMMON`, `UNCOMMON`, `RARE`, `EPIC`, `MYTHIC`). |
| `rendering.guilloche_border` | Boolean | No | `false` | Enables mathematical spirograph banknote-style security borders. |
| `rendering.show_ingredients` | Boolean | No | `true` | Overlays the 3x3 crafting matrix in the corner of the map. |
| `lore` | List<String> | No | `[]` | List of MiniMessage lore strings displayed on the item. |
| `extra` | Key-Value | No | `{}` | Custom key-value pairs for scripts or external plugin hooks. |

---

## Validating YAML Before Deployment

Before reloading a live server, always test your files with the built-in validator:

```text
/cb validate
```

If you made a typo (such as `DIAMND_SWORD` instead of `DIAMOND_SWORD`), `/cb validate` will tell you the exact file and line number to fix.
