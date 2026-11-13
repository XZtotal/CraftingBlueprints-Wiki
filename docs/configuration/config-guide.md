# Configuration Guide (config.yml)

The primary configuration file is located at `plugins/CraftingBlueprints/config.yml`. This guide explains every option in clear, plain language with recommended settings for production servers.

---

## Complete Annotated Configuration

```yaml
# ============================================================ #
#             CRAFTINGBLUEPRINTS MASTER CONFIG                 #
# ============================================================ #

# Internal config version. Do not change manually.
config-version: 4

# Enable verbose debug logging in console.
# Set to 'false' in production to keep server logs clean.
debug: false

# ------------------------------------------------------------ #
# Core Gameplay Options
# ------------------------------------------------------------ #

# Prevent players from trading, dropping, or sharing physical blueprint items.
# When true, physical blueprints are bound to the UUID of the recipient.
item-ownership: true

# Enable high-resolution rendered schematics on Minecraft maps.
# When true, blueprints using FILLED_MAP display custom 128x128 graphics.
images-on-maps: true

# Allow server operators (OPs) to bypass all recipe restrictions.
# If true, OPs can craft any item without unlocking the blueprint.
op-bypass: true

# ------------------------------------------------------------ #
# Database Storage Configuration
# ------------------------------------------------------------ #

# Storage engine: 'sqlite' or 'mysql' (default: sqlite)
database-type: sqlite

# MySQL Settings (Ignored if database-type is sqlite)
database-name: crafting_blueprints
database-host: localhost
database-port: 3306
database-user: root
database-password: "your_strong_password"

# ------------------------------------------------------------ #
# Declarative File Management & Synchronization
# ------------------------------------------------------------ #

file-management:
  # Enable YAML synchronization ONLY on your primary management node (e.g., Hub/Lobby).
  # On worker nodes (Survival, Skyblock, Factions), set this to FALSE to load all blueprints
  # directly from the shared MySQL database without overwriting.
  sync-from-files: false

  # Directory relative to plugins/CraftingBlueprints/ for blueprints
  directory: "blueprints"

  # Directory for inactive preset archives and packs
  presets-directory: "presets"

  # Automatically delete blueprints from the database when removed from YAML files.
  prune-deleted: true

  # Automatic live file watcher (hot-reloads files when saved on disk)
  auto-reload:
    enabled: true
    # Debounce delay in milliseconds to prevent reading files while they are still being written
    debounce-delay-ms: 1500

# ------------------------------------------------------------ #
# In-Game Blueprint Exporter & Backups
# ------------------------------------------------------------ #

in-game-export:
  # Automatically export blueprints created in-game via GUI or commands
  enabled: true
  directory: "exports"
  file-name: "manual_blueprints.yml"
  auto-export-on-reload: true

  # Rolling backups of exported blueprints
  backups:
    enabled: true
    # Interval between backups (e.g., 30m, 1h, 6h, 1d)
    interval: 1h
    # Maximum number of rolling backup files to keep in exports/backups/
    max-count: 5

# ------------------------------------------------------------ #
# Recipe Restrictions & Whitelist Mode
# ------------------------------------------------------------ #

restrictions:
  # Operational mode:
  # - 'all': Every craftable item requires an unlocked blueprint.
  # - 'restricted-only': All Minecraft recipes are freely craftable,
  #   EXCEPT items listed in 'restricted-items'.
  mode: "restricted-only"

  # Items, materials, or categories that require a blueprint when in 'restricted-only' mode.
  # Supports exact names, wildcards (*), and regular expressions.
  restricted-items:
    - "diamond_.*"
    - "netherite_.*"
    - "enchanted_golden_apple"
    - "beacon"
    - "potion:strength.*"
    - "enchantment:mending"

# ------------------------------------------------------------ #
# Automated Crafter Interception (Minecraft 1.21+)
# ------------------------------------------------------------ #

crafter:
  # Intercept redstone-powered Crafter blocks
  enabled: true

  # Policy when an automated Crafter attempts to craft a locked recipe:
  # - 'block': Cancel the craft and retain materials safely in the grid.
  # - 'bypass': Allow automated crafters to craft without blueprint checks.
  policy: "block"
```

---

## Setting Highlights & Production Tips

### `item-ownership`
* **Default**: `true`
* **Why use it?** If disabled, players can pass around a single expensive blueprint map among their entire guild, allowing everyone to learn it from one item. With ownership enabled, only the assigned player can inspect and learn the blueprint.

### `op-bypass`
* **Default**: `true`
* **Gotcha**: If you are testing whether recipe restrictions work while having `/op`, you will still be able to craft the item! To test as a normal player, either deop yourself (`/deop <player>`) or set `op-bypass: false` temporarily.

### `file-management.sync-from-files`
> [!CAUTION]
> If connecting multiple servers to a shared MySQL database, set `sync-from-files: true` **only on one primary server** (e.g., Lobby). All other sub-servers must set this to `false`. See the [Multi-Server Setup Guide](../storage/mysql-multiserver.md).
