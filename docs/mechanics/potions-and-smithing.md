# Potions, Smithing Table & Specialized Workstations

Beyond standard 3x3 crafting tables, CraftingBlueprints intercepts and gates specialized Minecraft workstations: **Alchemy (Brewing Stands)**, **Smithing Tables (Netherite Upgrades & Armor Trims)**, **Smelting Furnaces**, **Stonecutters**, and **Enchantment Tables**.

---

## 1. Gating Alchemy & Potion Brewing

High-tier combat potions (Strength II, Speed II, Invisibility, Turtle Master) can destabilize PvP economies if left unrestricted. CraftingBlueprints tracks Brewing Stand operations in real time.

### Step 1: Restrict Potions in `config.yml`
Under `restrictions.restricted-items`, add potion patterns using the `potion:` category prefix:

```yaml
restrictions:
  mode: "restricted-only"
  restricted-items:
    - "potion:strength.*"
    - "potion:speed.*"
    - "potion:invisibility.*"
    - "potion:turtle_master.*"
```

### Step 2: Create the Alchemy Blueprint
In any blueprint file (e.g. `plugins/CraftingBlueprints/blueprints/alchemy.yml`):

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  elixir_of_strength:
    blueprint: STRENGTH
    name: "<gradient:#FF0000:#FF7700><bold>Elixir of Greater Strength Blueprint</bold></gradient>"
    permanent: true

    item:
      material: POTION
      glowing: true

    map:
      theme: transmutation_circle
      frame: runic
      badge: brewing

    lore:
      - "<gray>Classification:</gray> <gold>Master Alchemy</gold>"
      - "<gray>Unlocks:</gray> <white>Strength I & Strength II Brewing</white>"
      - ""
      - "<dark_gray>Right-click in hand to memorize the recipe.</dark_gray>"
```

### In-Game Brewing Interception:
1. When a player inserts ingredients and water bottles into a Brewing Stand, the plugin evaluates the output bottles upon brewing completion.
2. If the player who loaded the stand has unlocked the blueprint, the brewing completes successfully.
3. If the player lacks the blueprint, the brewing operation is blocked and ingredients remain safe.

---

## 2. Gating Smithing Table Upgrades (Netherite & Armor Trims)

Minecraft 1.20+ introduced the 3-slot Smithing Table requiring a **Smithing Template**, a **Base Item**, and an **Ingot/Crystal Addition**.

### Restricting Netherite Upgrades
To prevent players from upgrading Diamond equipment into Netherite without finding ancient schematics:

In `plugins/CraftingBlueprints/config.yml`:

```yaml
restrictions:
  mode: "restricted-only"
  restricted-items:
    - "netherite_sword"
    - "netherite_pickaxe"
    - "netherite_axe"
    - "netherite_shovel"
    - "netherite_hoe"
    - "netherite_helmet"
    - "netherite_chestplate"
    - "netherite_leggings"
    - "netherite_boots"
```

In your blueprint file (e.g. `blueprints/netherite.yml`):

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  ancient_netherite_smithing:
    blueprint: NETHERITE_CHESTPLATE
    name: "<gradient:#FF5555:#FFAA00><bold>Ancient Netherite Smithing Technique</bold></gradient>"
    permanent: true

    item:
      material: FILLED_MAP
      glowing: true

    map:
      theme: dwarven_magma
      frame: rosette
      badge: smithing
      item_outline:
        enabled: true
        width: 2
        color: "gold"

    lore:
      - "<gray>Target Equipment:</gray> <white>Netherite Upgrades</white>"
      - "<gray>Status:</gray> <green>Permanent Unlock</green>"
      - ""
      - "<yellow>Grants knowledge to forge Netherite armor.</yellow>"
```

### In-Game Smithing Interception:
* When an unauthorized player inserts a Netherite Upgrade Template, a Diamond item, and a Netherite Ingot, the output slot remains locked.
* If `ux.prepare-preview.mode: "LOCKED_OVERLAY"` is configured, the output slot displays the Netherite item with red warning lore: `<red><bold>Recipe Locked: Requires Ancient Netherite Smithing Technique</bold></red>`.

---

## 3. Workstations Configuration (`stations`)

Under `stations:` in `plugins/CraftingBlueprints/config.yml`, configure workstation enforcement:

```yaml
stations:
  # Smelting Stations (Furnace, Blast Furnace, Smoker, Campfire)
  smelting:
    enabled: true
    restrict-furnace: true
    restrict-blast-furnace: true
    restrict-smoker: true
    restrict-campfire: true

    # Hopper Ownership Protection: tracks the player who placed the hopper.
    # Unowned hoppers cannot smelt restricted recipes.
    track-hoppers: true

    # Play fail click and smoke particles when a smelt is blocked
    fail-effect: true

  # Stonecutter Station
  stonecutter:
    enabled: true
    prepare-preview: true

  # Enchantment Table Station
  enchanting-table:
    enabled: true
    cancel-if-locked: true
    send-fail-message: true
```

### Hopper Protection for Automated Furnaces:
When players automate smelting using hoppers feeding into Furnaces or Blast Furnaces:
* When `track-hoppers: true` is enabled, CraftingBlueprints records the UUID of the player who placed the hopper into its PersistentDataContainer (PDC).
* The smelting station inherits the placer's blueprint unlocks.
* Hoppers placed by unauthorized players (or naturally generated hoppers) cannot automatically smelt restricted items.
