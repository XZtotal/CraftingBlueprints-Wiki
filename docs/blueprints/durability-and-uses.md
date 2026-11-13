# Durability, Expiration Limits & Usage Modes

CraftingBlueprints provides three distinct durability models to balance your server's crafting economy and progression. You can configure recipes to be **Permanent**, **Craft-Count Limited (Uses)**, or **Time-Limited (Timer Expiration)**, or combine them into hybrid licensing models.

---

## 1. Permanent Blueprints (`permanent: true`)

The player learns the recipe once and retains the permanent ability to craft it indefinitely:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  iron_pickaxe_mastery:
    blueprint: IRON_PICKAXE
    name: "<white>Iron Pickaxe Schematic</white>"

    # Permanent unlock: never expires, unlimited crafts
    permanent: true
    time: 0
    uses: 0

    item:
      material: FILLED_MAP
      glowing: false

    map:
      theme: technical
      frame: bracket
      badge: crafting

    lore:
      - "<gray>Target Equipment:</gray> <white>{target_item}</white>"
      - "<gray>Duration:</gray> <green>Permanent</green>"
      - ""
      - "<dark_gray>Right-click to permanently memorize this recipe.</dark_gray>"
```

* **Best For**: Milestone survival progression (e.g. unlocking Iron, Diamond, or Netherite tiers permanently).
* **Memory Invariant**: Stored once in the player's account database profile with no background timers or counters.

---

## 2. Craft-Count Limited Blueprints (`uses: 3`)

The player unlocks the recipe, but each completed craft decrements an internal usage counter. When the counter reaches zero, the recipe is consumed and automatically locked again:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  dragon_slayer_scroll:
    blueprint: NETHERITE_SWORD
    name: "<gradient:#9900EE:#FF0055><bold>Scroll of the Dragon Slayer</bold></gradient>"

    # Limited crafts: expires after exactly 3 crafts
    permanent: false
    time: 0
    uses: 3

    item:
      material: PAPER
      glowing: true

    map:
      theme: runic
      frame: runic
      badge: smithing
      stamp:
        show: true
        style: wax_seal
        text: "3x"

    lore:
      - "<gray>Target Equipment:</gray> <white>{target_item}</white>"
      - "<gray>Remaining Forges:</gray> <yellow><bold>{uses} / 3 crafts</bold></yellow>"
      - ""
      - "<yellow>Allows forging up to 3 blades before dissolving.</yellow>"
      - ""
      - "<dark_gray>Right-click in hand to bind this knowledge.</dark_gray>"
```

* **Best For**: Mythic weapons, dungeon boss drop scrolls, MMORPG magic forge tokens, or event prizes where you want to prevent players from mass-producing items and crashing the server economy.
* **Stacking Behavior**: If a player consumes another 3-use scroll while having 2 uses remaining, the plugin stacks the uses to 5.

---

## 3. Time-Limited Blueprints (`time: 86400` or `time: 24h`)

The player unlocks the recipe for a temporary duration measured from the exact moment of unlocking. While active, the player can craft unlimited items. When the timer expires, the recipe is automatically revoked:

=== "Raw Integer Seconds"
    ```yaml
    # yaml-language-server: $schema=./blueprint.schema.json
    singles:
      weekend_crossbow_pass:
        blueprint: CROSSBOW
        name: "<gold><bold>Weekend Tournament Crossbow License</bold></gold>"

        # Exactly 24 hours (86,400 seconds)
        permanent: false
        time: 86400
        uses: 0

        item:
          material: FILLED_MAP
          glowing: true

        map:
          theme: royal
          frame: diamond
          badge: crafting
          stamp:
            show: true
            style: clock
            text: "24h"

        lore:
          - "<gray>Target Equipment:</gray> <white>{target_item}</white>"
          - "<gray>License Duration:</gray> <aqua>{time}</aqua>"
          - "<gray>Craft Count:</gray> <green>Unlimited</green>"
    ```

=== "Human Duration String"
    ```yaml
    # yaml-language-server: $schema=./blueprint.schema.json
    singles:
      weekly_alchemist_license:
        blueprint: POTION
        name: "<light_purple><bold>7-Day Master Alchemist License</bold></light_purple>"

        # Human-readable 7 days duration
        permanent: false
        time: 7d
        uses: 0

        item:
          material: BOOK
          glowing: true

        lore:
          - "<gray>Permit Duration:</gray> <aqua>{time}</aqua>"
          - "<gray>Craft Count:</gray> <green>Unlimited</green>"
    ```

#### Supported Duration Units
The duration parser accepts human strings or raw integer seconds:
* `45s` $\rightarrow$ 45 seconds
* `30m` $\rightarrow$ 30 minutes (1,800 seconds)
* `12h` $\rightarrow$ 12 hours (43,200 seconds)
* `86400` or `24h` $\rightarrow$ 24 hours (86,400 seconds)
* `7d`  $\rightarrow$ 7 days (604,800 seconds)
* `30d` $\rightarrow$ 30 days (2,592,000 seconds)
* `0`   $\rightarrow$ No temporal expiration.

---

## 4. Hybrid Licensing (Combined Time & Uses)

You can specify both `time` and `uses` on a single blueprint. Whichever limit is reached first will expire and lock the recipe:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  seasonal_relic_shield:
    blueprint: SHIELD
    name: "<gradient:#00AAFF:#00FFAA><bold>Seasonal Aegis Shield</bold></gradient>"

    # Expires in 7 days OR after 5 crafts, whichever happens first
    permanent: false
    time: 7d
    uses: 5

    item:
      material: FILLED_MAP
      glowing: true

    map:
      theme: nautical_astrolabe
      frame: star
      badge: anvil

    lore:
      - "<gray>Target Equipment:</gray> <white>{target_item}</white>"
      - "<gray>Remaining Forges:</gray> <yellow>{uses} / 5</yellow>"
      - "<gray>Time Limit:</gray> <aqua>{time}</aqua>"
      - ""
      - "<yellow>Expires after 5 crafts or when time runs out.</yellow>"
```

---

## Shift-Craft Capacity & Anti-Exploit Math

In standard Minecraft plugins, shift-clicking crafting recipes can cause severe desynchronization, allowing players to duplicate items or craft 64 items while only deducting 1 use from their counter.

CraftingBlueprints eliminates this exploit via an atomic **Shift-Craft Rule Engine** (`ShiftCraftMath.kt`):

1. **Matrix Ingredient Capacity**: Evaluates the minimum ingredient count across all matrix slots to calculate maximum possible crafts:
   $$\text{MaxMatrixCrafts} = \min_{s \in \text{slots}}(\text{amount}_s)$$
2. **Inventory Destination Capacity**: Evaluates the player's empty inventory slots and partial stacks to determine the exact number of crafted items that can fit safely without overflowing:
   $$\text{MaxSpaceCrafts} = \left\lfloor \frac{\text{FreeSpace}}{\text{RecipeYield}} \right\rfloor$$
3. **Usage Bound**: Evaluates the remaining uses on the player's active blueprint:
   $$\text{CraftCount} = \min(\text{MaxMatrixCrafts}, \text{MaxSpaceCrafts}, \text{RemainingUses})$$
4. **Atomic Execution**: If a player with **2 remaining uses** shift-clicks a recipe with 64 iron ingots in the matrix, the engine crafts **exactly 2 items**, deducts **exactly 2 uses**, locks the recipe, and leaves the remaining 62 iron ingots untouched in the crafting table.

---

## How Players Track Active Uses & Timers

Players have multiple real-time tools to monitor their active blueprints:

1. **Personal Dashboard (`/cb menu`)**:
   Shows all active recipes, remaining craft counts, and live countdown timers (e.g. `Expires in 3d 14h`).
2. **Catalog Inspection (`/cb item list`)**:
   Hovering over any blueprint displays dynamic status badges:
   * :white_check_mark: **Unlocked** (Permanent)
   * :hourglass: **Active: 3/5 Uses** (Limited)
   * :lock: **Locked**
3. **PlaceholderAPI Variables**:
   * `%craftingblueprints_uses_<id>%`: Returns remaining uses (or `unlimited`).
   * `%craftingblueprints_time_<id>%`: Formatted remaining time (e.g. `23h 12m`).
   * `%craftingblueprints_is_unlocked_<id>%`: Returns `true` or `false`.
