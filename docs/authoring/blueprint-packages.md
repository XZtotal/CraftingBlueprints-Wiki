# Blueprint Packs & Packages

Blueprint packages (`packages:`, domain type 1 / `PACKAGE_TYPE`) group multiple blueprints into a single bundled item. When a player right-clicks the package in hand, all contained blueprints are unlocked simultaneously.

Packages are ideal for progression milestones, class gear kits (such as a full Netherite Armor Set or Starter Miner Kit), quest milestone rewards, and seasonal donation store bundles.

---

## Declaring a Package (`packages:`)

Packages are authored under a root-level `packages:` block in any blueprint YAML file.

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
# ==============================================================================
# CraftingBlueprints - Gear Packages Configuration
# ==============================================================================

packages:
  # ----------------------------------------------------------------------------
  # Master Blacksmith Equipment Kit
  # ----------------------------------------------------------------------------
  blacksmith_master_pack:
    name: "<gold><bold>Master Blacksmith Equipment Pack</bold></gold>"
    lore:
      - "<gray>A sealed guild satchel containing the master schematics"
      - "<gray>required to forge complete Netherite equipment."
      - ""
      - "<yellow>Contents:</yellow> <white>{blueprints_count} Schematics</white>"
      - "<yellow>Quality:</yellow> <gold>{tier}</gold>"
      - ""
      - "<green>Shop Price:</green> <gold>${price}</gold>"
      - "<dark_gray>Right-click in hand to break the wax seal and learn all contents.</dark_gray>"
    price: 75000.0
    sell_price: 18750.0
    item:
      material: BOOK
      custom_model_data: 4001
      glowing: true
    extra:
      tier: "LEGENDARY"
      category: "bundles"
    blueprints:
      # Reference existing single blueprint IDs
      - id: netherite_chestplate_blueprint
      - id: netherite_sword_blueprint

      # Declare inline blueprint definitions
      - blueprint: NETHERITE_HELMET
        name: "<gray>Netherite Helmet Schematic</gray>"
        permanent: true
        uses: 0

      - blueprint: NETHERITE_LEGGINGS
        name: "<gray>Netherite Leggings Schematic</gray>"
        permanent: true
        uses: 0

      - blueprint: NETHERITE_BOOTS
        name: "<gray>Netherite Boots Schematic</gray>"
        permanent: true
        uses: 0
```

---

## Referenced vs. Inline Blueprints

Packages provide the flexibility to combine both **referenced blueprints** and **inline definitions** in the same `blueprints:` list:

### Option 1: Referenced Blueprint (`- id: <blueprint_id>`)
You can reference pre-existing single blueprints by their unique identifier:

```yaml
blueprints:
  # Formal map notation
  - id: netherite_chestplate_blueprint
  # Simple string shorthand
  - diamond_pickaxe_permit
```

- **Reusability**: Changes to the referenced single blueprint (such as adjusting its name, lore, or durability) automatically propagate to every package containing it.
- **Deduplication**: If a player already unlocked one of the referenced blueprints individually, unlocking the package grants only the remaining missing schematics (or adds usage charges if usage-limited).

### Option 2: Inline Blueprint Definition
You can declare blueprint specifications directly inside the package without creating separate files:

```yaml
blueprints:
  - blueprint: DIAMOND_AXE
    name: "<aqua>Diamond Lumberjack Axe</aqua>"
    permanent: false
    uses: 10
    station: CRAFTING_TABLE
```

- **Encapsulation**: Inline blueprints are exclusive to this package and do not clutter your server's global blueprint catalog.
- **Independent Durability**: Each inline blueprint can have its own independent durability mode, usage count, expiration timer, and workstation constraints.

---

## Two-Tier Property Architecture

Packages feature two distinct tiers of properties:

```
┌────────────────────────────────────────────────────────┐
│               Container-Level Properties               │
│  name, lore, item (BOOK/BUNDLE), price, sell_price     │
│  Governs the physical item held in hand or sold in shop│
└──────────────────────────┬─────────────────────────────┘
                           │ Unlocked via Right-Click
                           ▼
┌────────────────────────────────────────────────────────┐
│             Sub-Item Properties (blueprints:)          │
│  blueprint, permanent, uses, time, station             │
│  Governs the individual crafting knowledge unlocked    │
└────────────────────────────────────────────────────────┘
```

1. **Container-Level Properties**:
   - `name:`, `lore:`, `item:`, `price:`, `sell_price:`, and `extra:` govern the physical package item when held by a player or traded in shops.
   - Dynamic placeholder `{blueprints_count}` automatically renders the total number of blueprints bundled inside.
2. **Sub-Item Properties**:
   - Each item in `blueprints:` dictates what crafting access is unlocked upon redemption.
   - Once opened, the package item is consumed from the player's inventory, and each contained blueprint is registered into their progression profile.

---

## The 24-Item Grid Limit

CraftingBlueprints enforces a strict architectural design limit of **$\le 24$ blueprints** per package:

```
┌────────────────────────────────────────────────────────┐
│             Package Portfolio Display (6x4)            │
├────────────────────────────────────────────────────────┤
│  [BP 1 ]  [BP 2 ]  [BP 3 ]  [BP 4 ]  [BP 5 ]  [BP 6 ]  │
│  [BP 7 ]  [BP 8 ]  [BP 9 ]  [BP 10]  [BP 11]  [BP 12]  │
│  [BP 13]  [BP 14]  [BP 15]  [BP 16]  [BP 17]  [BP 18]  │
│  [BP 19]  [BP 20]  [BP 21]  [BP 22]  [BP 23]  [BP 24]  │
└────────────────────────────────────────────────────────┘
```

### Why the 24-Item Limit Exists:
1. **Inventory GUI Ergonomics**: In interactive inspection menus (`/cb menu` and `/cb item info`), packages render their contents in clean, readable chest slots without requiring messy multi-page pagination for a single bundle.
2. **Extended Map Graphics Precision**: On CraftingBlueprints Extended, packages render an architectural portfolio grid displaying miniature $16\times16$ Minecraft item sprites. A $6\times4$ grid cleanly fills the central $128\times128$ map canvas while leaving appropriate margins for headers and title plaques.
3. **Overflow Handling**: If a package accidentally contains more than 24 blueprints, the first 23 items are rendered normally, and the 24th slot displays an enameled `+N` overflow badge indicating additional contents.

---

## Administrative Commands & Item Distribution

Administrators can grant package items directly to players or configure them in crate plugins, quest engines, and shops:

### Granting Packages via Command
To grant a package to a player:

```text
/cb give <player> <package_id> [amount]
```

#### Example:
```text
/cb give Steve blacksmith_master_pack 1
```

Steve receives the physical `Master Blacksmith Equipment Pack` item in his inventory.

### Right-Click Redemption Mechanics:
1. **Hand Interaction**: Steve holds the package in his main hand and right-clicks.
2. **Consumption**: The package item is safely decremented by 1 from his inventory stack.
3. **Atomic Unlock**: All bundled blueprints are simultaneously written to Steve's profile in `PlayerDB`.
4. **Packet Updates**: Recipe book synchronization packets are dispatched for all unlocked items.
5. **Feedback**: Steve hears an anvil chime and sees glowing gold particles celebrating the unlock.
