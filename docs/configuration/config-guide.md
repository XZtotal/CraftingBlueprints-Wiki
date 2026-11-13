# Master Configuration Guide (config.yml)

The primary configuration file for CraftingBlueprints is located at `plugins/CraftingBlueprints/config.yml`. This guide provides an exhaustive, line-by-line reference for every configuration key, explaining its exact in-game behavior, recommended values for production servers, and operational gotchas.

---

## Annotated Production `config.yml`

```yaml
# ============================================================ #
#             CRAFTINGBLUEPRINTS MASTER CONFIG                 #
# ============================================================ #

# Internal schema version. Do not modify manually.
config-version: 4

# Enable verbose debug logging in console.
# Keep set to 'false' in production to maintain a clean console and high performance.
debug: false

# ------------------------------------------------------------ #
# Core Gameplay Rules
# ------------------------------------------------------------ #

# Restrict physical blueprint items to their original recipient UUID.
# - true: Prevents players from trading, dropping, or sharing physical blueprint maps.
#         Only the player whose UUID is stamped on the item may hold and learn it.
# - false: Blueprints are completely tradeable physical commodities.
item-ownership: true

# Render custom 128x128 pixel visual schematics on in-game maps (Material.FILLED_MAP).
# When true, physical blueprints display thematic backgrounds, borders, and item sprites.
images-on-maps: true

# Allow server operators (/op) to bypass all recipe restrictions.
# - true: Server operators can craft, smelt, brew, and enchant any locked recipe.
# - false: Operators are subject to the same blueprint progression as normal players.
op-bypass: true

# ------------------------------------------------------------ #
# Database Storage Configuration
# ------------------------------------------------------------ #

# Storage engine backend: 'sqlite' or 'mysql' (default: sqlite)
database-type: sqlite

# Database name (for SQLite: filename without .db; for MySQL: target database name)
database-name: crafting_blueprints

# MySQL Connection Parameters (Ignored when database-type is 'sqlite')
database-host: localhost
database-port: 3306
database-user: root
database-password: "your_strong_password"

# ------------------------------------------------------------ #
# Declarative File Management & Synchronization
# ------------------------------------------------------------ #

file-management:
  # Multi-Server Golden Rule:
  # - true: ONLY on the designated Primary Management Node (e.g. Hub/Lobby).
  #         Imports local YAML files into the shared database and prunes deleted items.
  # - false: On ALL Worker Nodes (Survival, Skyblock, Factions).
  #          Worker nodes load blueprints strictly from the shared MySQL database.
  sync-from-files: false

  # Directory relative to plugins/CraftingBlueprints/ where blueprint YAMLs reside.
  directory: "blueprints"

  # Directory where inactive preset packages, zip bundles, and folders are stored.
  presets-directory: "presets"

  # If true, file-managed blueprints that are deleted from YAML files on disk
  # are automatically pruned from the database during reload.
  # Manually created in-game blueprints are NEVER pruned by this option.
  prune-deleted: true

  # Automatic live file watcher (hot-reloads when files change on disk)
  auto-reload:
    enabled: true
    # Debounce delay in milliseconds to prevent reading files while still being saved by editors
    debounce-delay-ms: 1500

# ------------------------------------------------------------ #
# In-Game Blueprint Exporter & Rolling Backups
# ------------------------------------------------------------ #

in-game-export:
  # Automatically export blueprints created in-game via GUI or commands into a YAML file
  enabled: true

  # Automatically generate diagnostic text reports (minecraft_recipes.txt,
  # groups_recipes.txt, registered_blueprints.txt, system_summary.txt) in exports/ on reload
  auto-export-on-reload: true

  # Subdirectory relative to plugins/CraftingBlueprints/
  directory: "exports"
  file-name: "manual_blueprints.yml"

  # Rolling backups of exported manual blueprints
  backups:
    enabled: true
    # Backup interval (e.g., 30m, 1h, 6h, 1d)
    interval: 1h
    # Maximum number of rolling backup files to retain in exports/backups/
    max-count: 5

# ------------------------------------------------------------ #
# Permission Groups & Recipe Inheritance
# ------------------------------------------------------------ #

# Permission groups unlock categories of recipes via: craftingblueprints.group.<id>
# Supports direct material names, regex (.*planks), wildcards (*gold*),
# potion effects (potion:strength.*), enchantments (enchantment:mending),
# and multi-parent inheritance (inherits: [groupA, groupB]).
groups:
  default:
    name: "Default"
    blueprints:
      - stick
      - ".*planks"
      - ".*door"
      - ".*fence"
      - ".*stairs"
      - ".*slab"
      - ".*pressure_plate"
      - ".*button"
      - ".*sign"
      - ".*chest"
      - ".*bed"
      - "wooden.*"
      - "stone.*"

  vip:
    name: "VIP"
    inherits:
      - default
    blueprints:
      - iron_ingot
      - "iron_.*"
      - "shield"
      - "crossbow"

  pro:
    name: "Pro"
    inherits:
      - vip
    blueprints:
      - "*gold*"
      - "diamond_.*"
      - "netherite_.*"

  alchemist:
    name: "Alchemist"
    blueprints:
      - "brewing_stand"
      - "glass_bottle"
      - "potion:.*"
      - "healing.*"
      - "speed.*"
      - "strength.*"

  enchanter:
    name: "Enchanter"
    blueprints:
      - "enchanting_table"
      - "anvil"
      - "enchantment:.*"
      - "silk_touch"
      - "unbreaking.*"
      - "mending"

# ------------------------------------------------------------ #
# Cache & Memory Management
# ------------------------------------------------------------ #

cache:
  # Blueprint items cache in RAM
  items:
    max-size: 1500

  # Player profiles cache in RAM
  players:
    # Maximum active player profiles kept in memory simultaneously
    max-size: 500
    # Grace period in seconds before an offline player's profile is evicted
    disconnect-grace-period-seconds: 5
    # Scavenger task interval in seconds to purge idle offline profiles
    orphan-scavenger-interval-seconds: 30
    # Threshold window in seconds where an offline player is considered active if queried
    active-access-threshold-seconds: 30

  # Map graphics byte buffer cache
  maps:
    # Maximum pre-quantized 128x128 palette byte buffers (16 KB each) cached in RAM
    max-cached-buffers: 500

# ------------------------------------------------------------ #
# PlaceholderAPI Integration
# ------------------------------------------------------------ #

placeholderapi:
  # Direct read-only database query when a requested blueprint or player is not in RAM cache.
  # - false (recommended for optimal TPS): returns default values ("false", "0") immediately
  #   and warms cache asynchronously in the background.
  # - true: queries database synchronously on cache miss.
  query-database-on-cache-miss: false

  # Allow synchronous database queries on the server main thread for placeholders.
  # Default: false (HIGHLY RECOMMENDED). Prevents server tick drops when scoreboards refresh.
  allow-sync-queries-on-main-thread: false

# ------------------------------------------------------------ #
# Automated Crafter Interception (Minecraft 1.21+)
# ------------------------------------------------------------ #

crafter:
  # If true, redstone-powered Crafter blocks are blocked from crafting blueprint-locked recipes.
  # If false, Crafters bypass player checks and craft all recipes automatically.
  block-restricted: true

  # Play a dispenser fail click sound and smoke particles at the Crafter when crafting is blocked.
  fail-effect: true

# ------------------------------------------------------------ #
# Custom Item Matcher SPI (External Plugins)
# ------------------------------------------------------------ #

item-matching:
  # Master toggle for custom item inspection SPI
  enabled: true

  # Fallback policy: if a custom item (e.g. ItemsAdder/Nexo weapon) does NOT have
  # its own custom blueprint, should it fall back to requiring the base vanilla material blueprint?
  # - true (recommended): Prevents players from crafting OP custom swords just because
  #   an administrator forgot to write an explicit custom blueprint for them.
  # - false: Custom items without explicit blueprints are freely craftable.
  fallback-to-vanilla: true

  providers:
    itemsadder:
      enabled: true
      priority: 100
      prefix: "ia"

    nexo:
      enabled: true
      priority: 100
      prefix: "nexo"

    oraxen:
      enabled: true
      priority: 100
      prefix: "oraxen"

    mmoitems:
      enabled: true
      priority: 100
      prefix: "mmoitems"

    ecoitems:
      enabled: true
      priority: 90
      prefix: "ecoitems"
      pdc-key: "ecoitems:item"

    mythicmobs:
      enabled: true
      priority: 90
      prefix: "mythicmobs"
      pdc-key: "mythicmobs:type"

    recipe-key:
      enabled: true
      priority: 80
      prefix: "recipe"

    custom-model-data:
      enabled: true
      priority: 50
      allow-at-syntax: true

    generic-pdc:
      enabled: true
      priority: 40
      prefix: "pdc"
      watched-keys:
        - "customcrafting:id"
        - "executableitems:id"

# ------------------------------------------------------------ #
# Workstations & Specialized Stations
# ------------------------------------------------------------ #

stations:
  # Smelting Stations (Furnaces, Blast Furnaces, Smokers, Campfires)
  smelting:
    enabled: true
    restrict-furnace: true
    restrict-blast-furnace: true
    restrict-smoker: true
    restrict-campfire: true

    # Hopper protection: track player ownership of hoppers feeding into furnaces.
    # If true, automated hoppers inherit the placer's blueprint unlocks.
    # Unowned hoppers cannot smelt restricted recipes.
    track-hoppers: true

    # Play fail sound and smoke particles when a furnace smelt is blocked
    fail-effect: true

  # Stonecutter Station
  stonecutter:
    enabled: true
    # Display locked preview icons in the stonecutter result slot
    prepare-preview: true

  # Enchantment Table Station
  enchanting-table:
    enabled: true
    # Cancel the enchantment if the player lacks the blueprint for any applied enchantment
    cancel-if-locked: true
    # Notify the player in chat explaining which blueprint is missing
    send-fail-message: true

# ------------------------------------------------------------ #
# Recipe Restrictions & Whitelist Mode
# ------------------------------------------------------------ #

restrictions:
  # Operational mode:
  # - 'restricted-only': Whitelist mode where ALL standard Minecraft items and recipes
  #   are freely craftable by everyone by default!
  #   ONLY items matching 'restricted-items' require a blueprint. (Recommended for SMP).
  # - 'all': Universal progression mode where EVERY craftable item requires a blueprint.
  mode: "restricted-only"

  # List of items, materials, potions, or enchantments that require blueprints.
  # Supports exact names, wildcards (*), regular expressions (.*),
  # and optional category prefixes (craft:, potion:, enchant:).
  restricted-items:
    - "diamond_.*"
    - "netherite_.*"
    - "enchanted_golden_apple"
    - "beacon"
    - "potion:strength.*"
    - "potion:speed.*"
    - "enchantment:mending"
    - "enchantment:sharpness.*"

# ------------------------------------------------------------ #
# User Experience & Client Previews (UX)
# ------------------------------------------------------------ #

ux:
  vanilla-recipe-book:
    # Synchronize unlocked recipes with the player's vanilla Recipe Book upon joining
    sync-on-join: true
    # Synchronize incrementally when blueprints are unlocked, expire, or groups change
    sync-on-unlock-expire: true
    # If true, hides locked recipes from the green Recipe Book; if false, only warns on preview
    hide-locked-recipes: true

  prepare-preview:
    # Show clear locked feedback in Crafting, Smithing, and Anvil result slots
    enabled: true
    # Available modes:
    # - 'HIDE_RESULT': Clears the output slot when locked
    # - 'LOCKED_OVERLAY' (alias 'LOCKED_LORE'): Keeps original item icon with locked name/lore warning
    # - 'CUSTOM_ITEM' (alias 'BARRIER_ICON'): Shows the configured locked-item below
    mode: "LOCKED_OVERLAY"
    locked-item:
      material: BARRIER
      custom-model-data: 4001
      name: "<red><bold>Recipe Locked</bold></red>"
      lore:
        - "<gray>Required Blueprint:</gray> <yellow>{blueprint_name}</yellow>"
        - "<gray>Run</gray> <aqua>/cb info {blueprint_name}</aqua> <gray>to view details.</gray>"
```

---

## Detailed Section Breakdown

### 1. Core Gameplay Settings

#### `item-ownership`
* **Default**: `true`
* **Operational Purpose**: Prevents exploit trading. When `true`, physical blueprint items (`FILLED_MAP`, `PAPER`, etc.) have the recipient's UUID permanently stamped into their Persistent Data Container (PDC). Only the bound player can hold, inspect, and right-click to memorize the blueprint. If set to `false`, blueprints become tradeable commodities that players can sell, drop, or share across player factions.

#### `images-on-maps`
* **Default**: `true`
* **Operational Purpose**: Activates the native 128x128 map compositing engine. When `true`, any blueprint using `item.material: FILLED_MAP` renders a high-resolution drafting schematic featuring background textures, Guilloche corner frames, workstation badges, and item sprites. If disabled, blueprints render as standard vanilla maps.

#### `op-bypass`
* **Default**: `true`
* **Gotcha**: If you are testing recipe locks while having `/op` status, the plugin will allow you to craft the locked item freely! To test properly as an unauthorized player, either run `/deop <your_name>` or temporarily set `op-bypass: false`.

---

### 2. Multi-Server File Management (`file-management`)

!!! caution "The Golden Rule of Multi-Server Networks"
    On networks connected to a shared MySQL database, set `sync-from-files: true` **strictly on ONE Primary Management Node** (e.g. Lobby or Admin server). On all Worker Nodes (Survival, Skyblock, Factions), set `sync-from-files: false`.

* **`sync-from-files: true` (Primary Node)**: Recursively parses local YAML files in `blueprints/`, inserts/updates them in the shared database, safely prunes deleted blueprints (`prune-deleted: true`), and emits a real-time signal ping (`cb_sync_signals`) alerting worker nodes.
* **`sync-from-files: false` (Worker Nodes)**: Loads all blueprints directly from the shared MySQL database into memory. Worker nodes never overwrite the database with local files, eliminating race conditions.
* **`auto-reload.debounce-delay-ms`**: Sets the delay (default: `1500ms`) to wait before hot-reloading after a file is saved on disk, ensuring editors finish writing multi-byte files.

---

### 3. Redstone Crafter Interception (`crafter`)

* **`block-restricted: true`**: In Minecraft 1.21+, redstone-powered Crafter blocks (`Material.CRAFTER`) craft automatically without player clicks. When this setting is `true`, any attempt by an automated Crafter to produce a recipe restricted in `restrictions.restricted-items` is immediately intercepted and blocked.
* **`fail-effect: true`**: When blocked, plays the dispenser fail sound (`Sound.BLOCK_DISPENSER_FAIL`) and spawns smoke particles at the Crafter's coordinates, signaling that the automated process is locked.
* If set to `block-restricted: false`, Crafters bypass all blueprint checks, allowing redstone factories to mass-produce locked items.

---

### 4. Custom Item Identification (`item-matching`)

Modern RPG servers use custom item frameworks where hundreds of custom weapons share the base vanilla material `DIAMOND_SWORD`. The `item-matching` SPI inspects items in order of priority:

1. **`itemsadder` (`ia:<namespace:id>`)**: Hooks into ItemsAdder custom stacks.
2. **`nexo` (`nexo:<id>`)**: Hooks into Nexo custom items.
3. **`oraxen` (`oraxen:<id>`)**: Hooks into Oraxen custom items.
4. **`mmoitems` (`mmoitems:<TYPE>:<ID>`)**: Hooks into MMOItems equipment.
5. **`ecoitems` (`ecoitems:<id>`)**: Reads native Paper PDC key `ecoitems:item`.
6. **`mythicmobs` (`mythicmobs:<id>`)**: Reads native Paper PDC key `mythicmobs:type`.
7. **`recipe-key` (`recipe:<namespace>:<key>`)**: Matches custom datapack recipes.
8. **`custom-model-data`**: Matches by CustomModelData integers.

#### `fallback-to-vanilla: true` (Economy Safety Net)
When `true`, if a custom sword (e.g. `ia:weapons:flame_blade`) does not have its own explicit custom blueprint, but the base material (`DIAMOND_SWORD`) is restricted, the player must unlock the base Diamond Sword blueprint to craft it. This prevents players from bypassing progression by crafting custom variants.

---

### 5. Workstations & Stations (`stations`)

* **`smelting.track-hoppers: true`**: Tracks the UUID of the player who placed hoppers feeding into smelting stations (Furnaces, Blast Furnaces, Smokers). Smelting only processes restricted recipes if the placing player owns the corresponding blueprint. Unowned or natural hoppers cannot smelt restricted items.
* **`enchanting-table.cancel-if-locked: true`**: Prevents players from applying high-tier enchantments (such as Mending or Sharpness V) at an Enchantment Table unless they have unlocked the blueprint.

---

### 6. User Experience & Result Slot Previews (`ux`)

#### `ux.vanilla-recipe-book`
* **`sync-on-join` & `sync-on-unlock-expire`**: Automatically synchronizes the green vanilla Recipe Book with the player's unlocked blueprints.
* **`hide-locked-recipes: true`**: Removes locked recipes from the client Recipe Book so players only see recipes they are certified to craft.

#### `ux.prepare-preview`
Controls what appears in the crafting result slot when an unauthorized player arranges ingredients for a locked recipe:
* **`HIDE_RESULT`**: The output slot is completely empty.
* **`LOCKED_OVERLAY`**: Keeps the output item icon, but appends warning lore explaining that the recipe is locked.
* **`CUSTOM_ITEM`**: Replaces the output slot with the item defined in `locked-item` (e.g., a red Barrier block with custom model data).
