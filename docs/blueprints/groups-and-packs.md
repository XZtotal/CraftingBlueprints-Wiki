# Blueprint Packs, Packages & Permission Groups

CraftingBlueprints provides multiple ways to manage collections of recipes together:

1. **Multi-Recipe Packages (`packages:`)**: Single physical or virtual items that unlock an entire collection of recipes simultaneously (such as a full armor set).
2. **Mystery Blueprints (`mysteries:`)**: Probability-weighted loot scrolls that roll a random reward from a pool upon right-click.
3. **Permission Groups (`groups:` in `config.yml`)**: Virtual permission tiers assigned to player ranks via LuckPerms (`craftingblueprints.group.<id>`).

---

## 1. Multi-Recipe Packages (`packages:`)

A Package Blueprint is an item that, when unlocked, grants multiple recipes at once. It is ideal for complete armor sets, tool lines, builder palettes, and class starter kits.

### Full Armor Set Example (Netherite Vanguard Pack)

In any blueprint file (e.g. `plugins/CraftingBlueprints/blueprints/armor_packs.yml`):

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
packages:
  netherite_vanguard_pack:
    name: "<gradient:#333333:#888888><bold>Netherite Vanguard Armor Set</bold></gradient>"

    # Physical representation in inventory and shop
    item:
      material: BOOK
      custom_model_data: 3001
      glowing: true

    # Economy settings for Vault shop
    price: 65000.0
    sell_price: 15000.0

    # Map portfolio aesthetics if rendered as map
    map:
      theme: forge
      frame: rosette
      badge: smithing
      stamp:
        show: true
        style: plaque
        text: "PACK"

    # List of child recipes unlocked together
    blueprints:
      # You can reference existing single blueprint IDs:
      - id: netherite_helmet_blueprint
      # Or define child recipes inline:
      - blueprint: NETHERITE_CHESTPLATE
        permanent: true
      - blueprint: NETHERITE_LEGGINGS
        permanent: true
      - blueprint: NETHERITE_BOOTS
        permanent: true

    # Lore layout supporting {blueprints_count} placeholder
    lore:
      - "<dark_gray><strikethrough>-----------------------------</strikethrough></dark_gray>"
      - "<gray>Package Type:</gray> <gold>Complete Armor Portfolio</gold>"
      - "<gray>Contained Schematics:</gray> <yellow><bold>{blueprints_count} Recipes</bold></yellow>"
      - "<dark_gray><strikethrough>-----------------------------</strikethrough></dark_gray>"
      - "<gray>• Netherite Helmet</gray>"
      - "<gray>• Netherite Chestplate</gray>"
      - "<gray>• Netherite Leggings</gray>"
      - "<gray>• Netherite Boots</gray>"
      - "<dark_gray><strikethrough>-----------------------------</strikethrough></dark_gray>"
      - "<yellow>Vault Purchase:</yellow> <green>${price}</green>"
      - "<dark_gray><strikethrough>-----------------------------</strikethrough></dark_gray>"
      - "<dark_gray>Right-click with book in hand to unlock all 4 recipes.</dark_gray>"
```

### In-Game Player Experience:
1. **Granting or Buying**: Distributed via `/cb give <player> netherite_vanguard_pack 1` or purchased via `/cb buy netherite_vanguard_pack --item`.
2. **Unlocking**: The player holds the book and **Right-Clicks**.
3. **Instant Set Access**: All 4 pieces (Helmet, Chestplate, Leggings, Boots) unlock simultaneously with a single fanfare sound.

---

## 2. Mystery Blueprints & Crate Rolls (`mysteries:`)

Mystery Blueprints act as self-contained loot crates or ancient arcane scrolls. When a player right-clicks the item, the plugin rolls against a probability-weighted reward pool:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
mysteries:
  ancient_dungeon_scroll:
    name: "<yellow><bold>Ancient Dungeon Mystery Scroll</bold></yellow>"

    item:
      material: PAPER
      custom_model_data: 4001
      glowing: true

    price: 10000.0
    sell_price: 2000.0

    # Weighted probability pool
    pool:
      # Common roll (Weight 60)
      - blueprint: IRON_SWORD
        weight: 60
        name: "<white>Iron Sword Schematic</white>"
        permanent: true

      # Rare roll (Weight 30)
      - blueprint: DIAMOND_SWORD
        weight: 30
        name: "<aqua>Diamond Blade Blueprint</aqua>"
        permanent: true

      # Epic roll referencing the full armor pack above (Weight 10)
      - id: netherite_vanguard_pack
        weight: 10

    lore:
      - "<gray>Artifact Type:</gray> <yellow>Sealed Arcane Scroll</yellow>"
      - "<gray>Possible Discoveries:</gray> <white>{pool_size} Schematics</white>"
      - ""
      - "<dark_gray>Right-click in hand to break the seal and roll a reward!</dark_gray>"
```

---

## 3. Permission Groups in `config.yml` (`groups:`)

Unlike physical packages that players hold in their inventories, **Permission Groups** are virtual recipe permissions tied to LuckPerms player ranks via `craftingblueprints.group.<id>`.

Configured in `plugins/CraftingBlueprints/config.yml`:

```yaml
groups:
  # Base default rank: basic survival items
  default:
    name: "Default"
    blueprints:
      - stick
      - ".*planks"
      - ".*door"
      - ".*fence"
      - ".*stairs"
      - ".*slab"
      - "wooden.*"
      - "stone.*"

  # VIP Rank: inherits all Default recipes automatically!
  vip:
    name: "VIP"
    inherits:
      - default
    blueprints:
      - iron_ingot
      - "iron_.*"
      - "shield"
      - "crossbow"

  # Pro Rank: multi-level inheritance (VIP + Default)
  pro:
    name: "Pro"
    inherits:
      - vip
    blueprints:
      - "*gold*"
      - "diamond_.*"
      - "netherite_.*"
```

### Pattern Matching in Groups:
* **Literal Materials**: `stick`, `iron_ingot`, `shield`.
* **Wildcard Globs**: `*gold*` matches anything containing the word gold.
* **Regular Expressions**: `iron_.*` matches all iron tools and armor; `.*planks` matches all wood plank types.
* **Potion Category**: `potion:strength.*` matches Strength brewing recipes.
* **Enchantment Category**: `enchantment:mending` matches Mending anvil combinations.

### Granting Groups via LuckPerms:
To grant a group to a player rank, assign the node `craftingblueprints.group.<id>`:

```bash
# Grant VIP recipe pack to the vip LuckPerms group
lp group vip permission set craftingblueprints.group.vip true

# Grant Pro recipe pack to the pro LuckPerms group
lp group pro permission set craftingblueprints.group.pro true
```
