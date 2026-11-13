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

### Supported Duration Formats

The `time:` field accepts either human-readable duration strings or raw integer seconds:

| Input Format | Unit / Duration | Evaluated Seconds |
| :--- | :--- | :--- |
| `45s` | 45 seconds | 45 |
| `30m` | 30 minutes | 1,800 |
| `12h` | 12 hours | 43,200 |
| `24h` or `86400` | 24 hours (1 day) | 86,400 |
| `7d` | 7 days (1 week) | 604,800 |
| `30d` | 30 days (1 month) | 2,592,000 |
| `0` | Unlimited | No time expiration |

---

## 4. Hybrid Licensing (Combined Time & Uses)

You can specify both `time` and `uses` on a single blueprint. Whichever limit is reached first will expire and lock the recipe:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  seasonal_relic_shield:
    blueprint: SHIELD
    name: "<gradient:#00AAFF:#00FFAA><bold>Seasonal Aegis Shield</bold></gradient>"

    # Expires in 7 days OR after 5 crafts, whichever occurs first
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

## Shift-Craft Bulk Crafting Protection

In standard Minecraft plugins, shift-clicking crafting recipes can cause severe desynchronization, allowing players to duplicate items or craft a full stack of 64 items while only deducting 1 use from their counter.

CraftingBlueprints eliminates this exploit via an atomic calculation on every shift-click:

1. **Ingredient Check**: Evaluates how many items can be created with the materials currently in the 3x3 crafting grid.
2. **Inventory Space Check**: Evaluates open inventory slots to determine how many items the player can safely hold without items dropping to the ground.
3. **Remaining Uses Bound**: Restricts the craft to the exact number of uses remaining on the player's blueprint.

**Example**:

* A player with **2 remaining uses** places materials for 8 Netherite Swords into the crafting grid and shift-clicks.
* The plugin crafts **exactly 2 swords** and deducts **exactly 2 uses**, immediately locking the recipe.
* The remaining ingredients for 6 swords remain completely safe in the crafting grid. Over-crafting is impossible.

---

## Tracking Active Uses & Timers

Players and administrators have multiple tools to monitor active blueprints:

### Personal Menu (`/cb menu`)
Running `/cb menu` displays a live dashboard of recipes unlocked by the player, showing remaining craft counts and live countdown timers (e.g. `Expires in 3d 14h`).

### Blueprint Inspection (`/cb info <blueprint_id>`)
Running `/cb info <id>` opens an inspection card displaying the recipe's durability mode, allowed crafts, expiration duration, and item details.

### Catalog Management (`/cb item list`)
Staff members with `craftingblueprints.item.list` can right-click any blueprint in the catalog to open its technical status preview (`SingleInfoMenu`), displaying permanence (Emerald/Redstone block), uses (Anvil), and remaining time (Clock).

### PlaceholderAPI Integration
Use these placeholders in scoreboards, tablists, or custom menus:

* `%craftingblueprints_uses_<id>%`: Returns remaining crafts (or `unlimited`).
* `%craftingblueprints_time_<id>%`: Formatted remaining time (e.g. `23h 12m`).
* `%craftingblueprints_is_unlocked_<id>%`: Returns `true` or `false`.
