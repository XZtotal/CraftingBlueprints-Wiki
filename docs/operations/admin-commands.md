# Admin Operations & Scaffolding

CraftingBlueprints provides a comprehensive administrative command suite designed for production server networks. Built with operational safety as a core principle, administrative commands feature strict argument bounds sanitization, zero-downtime subsystem reloads, non-destructive offline dry-run validation, and automated recipe scaffolding.

---

## Administrative Subcommands Reference Table

All administrative commands require elevated operator status or explicit permission nodes configured through your permission manager (such as [LuckPerms](luckperms-permissions.md)).

| Command | Arguments | Permission Node | Default State | Operational Description |
| :--- | :--- | :--- | :---: | :--- |
| **`/cb give`** | `<player> <id> [amount]` | `craftingblueprints.give` | `op` | Spawns physical blueprint items with strict input sanitization and anti-loss inventory drop protection. |
| **`/cb reload`** | `[target]` | `craftingblueprints.reload` | `false` | Performs targeted hot-reloading across blueprints, configurations, translations, images, or loot tables. |
| **`/cb validate`** | None | `craftingblueprints.admin` | `op` | Executes dry-run linting across all YAML files in `blueprints/` and `configs/` without altering the database. |
| **`/cb status`** | None | `craftingblueprints.status` | `op` | Displays the cluster node health dashboard, database ping latency, memory buffers, and sync conflicts. |
| **`/cb generate`** | `<source> [flags]` | `craftingblueprints.admin.generate` | `op` | Scans server recipes or external plugins (ItemsAdder, Nexo, Oraxen) and auto-scaffolds valid YAML blueprints. |
| **`/cb preset`** | `<subcommand> [flags]` | `craftingblueprints.admin.preset` | `op` | Deploys (`apply`), uninstalls (`remove`), lists, exports, or downloads 1-click progression presets. |
| **`/cb item list`** | None | `craftingblueprints.item.list` | `false` | Opens the paginated administrative catalog displaying all registered blueprints and immutability badges. |
| **`/cb item duplicate`**| `<source> <target>` | `craftingblueprints.item.duplicate` | `false` | Clones an existing blueprint into a new manual blueprint definition (`is_file_managed: false`). |
| **`/cb export`** | `[target]` | `craftingblueprints.admin.export` | `op` | Generates diagnostic audit text files (`minecraft_recipes.txt`, `groups_recipes.txt`, etc.) in `exports/`. |

---

## Detailed Command Specifications

### 1. Blueprint Distribution (`/cb give`)

Awards physical blueprint items to online players. Ideal for quest rewards, donation perks, crate rewards, or administrative interventions.

```bash
# Give 1x Diamond Chestplate Blueprint to player Alex:
/cb give Alex diamond_chestplate

# Give 16x Netherite Sword Blueprints to player Steve:
/cb give Steve netherite_sword 16
```

#### Operational Safeguards & Input Sanitization:
- **Quantity Bounds**: The `amount` parameter is strictly bounded:
  $$1 \le \text{amount} \le 2304$$
  Values $\le 0$, non-numeric characters, or quantities exceeding a full player inventory ($36 \text{ slots} \times 64 = 2304$) are rejected immediately.
- **Physical Leftover Preservation (Anti-Loss Protection)**:
  When invoking `inventory.addItem(...)`, any items that cannot fit into the target player's inventory are captured in the leftovers map. The engine **never deletes overflowing items silently**; instead, all unplaced `ItemStack` instances are spawned directly at `player.location` in the world via `world.dropItem(...)` and an inventory full notice is returned.

---

### 2. Zero-Downtime Hot Reloading (`/cb reload`)

Reloads specific subsystems of the plugin in real time without requiring a server restart or the dangerous `/reload` command.

```bash
# Reload all subsystems simultaneously:
/cb reload all

# Reload only blueprint YAML files in blueprints/:
/cb reload blueprints

# Reload only config.yml and recipe book sync:
/cb reload config

# Reload translation locale files in messages_*.yml:
/cb reload lang

# Reload world chest loot injection in loot.yml:
/cb reload loot

# Regenerate diagnostic reports in exports/:
/cb reload exports

# Clear and re-render map graphics buffers:
/cb reload images
```

> [!WARNING]
> **Never Use Bukkit `/reload`**  
> Running Minecraft's global `/reload` command causes memory leaks, breaks database connection pools (HikariCP), and corrupts player sessions. Always use `/cb reload [target]` for seamless in-game configuration updates.

---

### 3. Dry-Run Configuration Linting (`/cb validate`)

Performs an in-memory compilation and dry-run syntax audit of every file inside `plugins/CraftingBlueprints/blueprints/` and `plugins/CraftingBlueprints/configs/`.

```bash
/cb validate
```

#### Diagnostic Report Output:
```text
[CraftingBlueprints] === DRY-RUN VALIDATION REPORT ===
[CraftingBlueprints] Scanned 14 files across blueprints/ and configs/.
[CraftingBlueprints] Valid Blueprints: 124 (96 singles, 18 packages, 10 mysteries)
[CraftingBlueprints] Fatal Syntax Errors: 0
[CraftingBlueprints] Skipped Items: 1
  - Skipped 'heavy_core_bp' in 'blueprints/1_21.yml': Material 'HEAVY_CORE' not recognized in this Minecraft version.
[CraftingBlueprints] Duplicate ID Warnings: 1
  - ID 'starter_sword' in 'blueprints/kits/beginner.yml' ignored: already defined in 'blueprints/weapons.yml' (First-Win).
[CraftingBlueprints] Visual Lint Suggestions: 1
  - File 'blueprints/armor.yml' (id: 'netherite_chestplate'): Unknown key 'roseta' under 'frame'. Did you mean 'rosette'?
[CraftingBlueprints] === END VALIDATION REPORT (Zero database modifications made) ===
```

#### Key Capabilities:
- **Zero Database Modification**: Executes strictly in-memory. Database records and active player caches remain untouched.
- **First-Win Collision Reporting**: Detects duplicate IDs across files and reports which file takes priority under alphabetical traversal.
- **Typo Suggestions**: Uses Levenshtein distance algorithms to suggest corrections for misspelled frame styles, badge types, and background themes.

---

### 4. Health Dashboard & Cluster Diagnostics (`/cb status`)

Displays comprehensive runtime telemetry, database health, memory utilization, and multi-server synchronization status.

```bash
/cb status
```

#### Health Metrics Inspected:

```
┌────────────────────────────────────────────────────────┐
│             CraftingBlueprints System Status           │
├────────────────────────────────────────────────────────┤
│ Server ID:      9e7f4c21-b32a-49e0-811d-25a80f83ec10   │
│ Role:           Master (is-master: true)               │
│ Database:       MySQL (Ping: 4ms | Pool: 2/10)         │
│ File Watcher:   Active (blueprints/ | 1500ms debounce) │
│ Cached Items:   142 total (138 file-managed, 4 manual) │
│ Storage Exporter: Active (exports/manual_blueprints.yml)│
│ Map Buffers:    12 cached / 128 max (192 KB RAM)       │
│ Network Nodes:  3 online (Hub-01, Survival-01, Sky-01) │
│ Cluster Health: OK (No split-brain master conflicts)   │
└────────────────────────────────────────────────────────┘
```

- **Database Ping Latency**: Measures live query latency (`SELECT 1`) to the central database.
- **Node Role Verification**: Confirms whether the instance is acting as an authoritative **Master** or read-only **Worker**.
- **Master Conflict Alert**: Warns if multiple servers have misconfigured `is-master: true`, preventing database split-brain desynchronization.

---

### 5. In-Game Catalog & Immutability (`/cb item`)

The `/cb item` command suite provides administrative inspection and duplication tools.

```bash
# Opens the paginated administrative catalog:
/cb item list

# Duplicates a blueprint into a manual, editable copy:
/cb item duplicate netherite_chestplate custom_netherite_chestplate
```

#### File-Managed Immutability Invariant:
Blueprints defined in YAML configuration files (`blueprints/`) have their `is_file_managed` flag set to `true`.
- In `/cb item list`, file-managed blueprints display a prominent **`[⚡ Archivo]`** badge in their lore.
- Commands that attempt to modify file-managed blueprints in-game (`/cb item edit`, `/cb item edit-name`, `/cb item edit-lore`, `/cb item delete`) are **strictly blocked**.
- To customize a file-managed blueprint, edit its YAML file directly or use `/cb item duplicate` to create an unmanaged copy.

---

## Automated Recipe Scaffolder (`/cb generate`)

The automated recipe scaffolder solves the "blank page problem" by scanning existing server recipes, vanilla registries, or external custom item plugins and generating schema-valid blueprint YAML files.

### Command Syntax

```bash
/cb generate <source> [flags]
```

### Supported Sources

| Source Identifier | Source Description | Content Scanned |
| :--- | :--- | :--- |
| `minecraft` | Vanilla Minecraft recipes | All craftable recipes registered in `Bukkit.recipeIterator()`. |
| `weapons` | Built-in category | Swords, axes, bows, crossbows, tridents, maces, shields, arrows. |
| `armor` | Built-in category | Helmets, chestplates, leggings, boots, horse armor, turtle shells. |
| `tools` | Built-in category | Pickaxes, shovels, hoes, fishing rods, flint and steel, shears, brushes. |
| `potions` | Built-in category | All registered potion brewing types (`potion:*`). |
| `enchantments` | Built-in category | All registered vanilla enchantments (`enchantment:*`). |
| `redstone` | Built-in category | Pistons, observers, hoppers, droppers, crafters, redstone components. |
| `food` | Built-in category | Food consumables, golden apples, suspicious stews, bread, cooked meats. |
| `building` | Built-in category | Stairs, slabs, walls, fences, bricks, terracotta, concrete. |
| `all` | Global registry | All craftable items, potions, and enchantments on the server. |
| `<namespace>:<cat>` | Scoped category | Filters a specific namespace (e.g. `minecraft:weapons` or `oraxen:armor`). |
| `itemsadder` | External plugin hook | Scans custom items and recipes registered in ItemsAdder. |
| `nexo` | External plugin hook | Scans custom items and mechanics registered in Nexo. |
| `oraxen` | External plugin hook | Scans custom items and armors registered in Oraxen. |

---

### Command Flags Reference

| Flag / Option | Argument | Default | Operational Behavior |
| :--- | :--- | :---: | :--- |
| `--mode` | `single` \| `package` | `single` | Generates individual blueprints (`singles:`) or bundled packages (`packages:`). |
| `--price-scale` | `<factor>` | `1.0` | Multiplies base economy prices (e.g. `1.5` = +50% cost). |
| `--filter` | `<regex>` | None | Filters generated IDs using a regular expression (e.g. `".*_sword$"`). |
| `--template` | `<name>` | None | Attaches a reusable template mixin from `templates/` to every entry. |
| `--out` | `<path.yml>` | Auto | Specifies destination file relative to `blueprints/` (e.g. `weapons/swords.yml`). |
| `--theme` | `<theme>` | Calibrated | Overrides map visual theme (e.g. `forge`, `royal`, `technical`). |
| `--frame` | `<frame>` | Calibrated | Overrides Guilloché frame style (e.g. `bracket`, `rosette`, `chamfer`). |
| `--prefix` | `<id_prefix>` | None | Prepends a prefix to all generated blueprint IDs to prevent collisions. |
| `--dry-run` | Flag | `false` | Previews matching count and sample IDs without writing to disk or database. |
| `--force` | Flag | `false` | Overwrites destination file and forces First-Win precedence over collisions. |
| `--no-reload` | Flag | `false` | Prevents automatic execution of `/cb reload` after scaffolding completes. |

---

### Scaffolder Examples

#### Example 1: Scaffolding Vanilla Weapons with Price Scaling
```bash
/cb generate weapons --filter ".*_sword$" --price-scale 1.5 --out weapons/swords.yml
```
Scans all sword recipes, scales base economy purchase prices by 1.5x, formats MiniMessage display titles, assigns `forge` map visual schemes, and saves the file to `plugins/CraftingBlueprints/blueprints/weapons/swords.yml`.

#### Example 2: Scaffolding a Tools Package Bundle
```bash
/cb generate tools --mode package --template economy_tier_2 --out kits/starter_tools.yml
```
Generates a package blueprint containing up to 24 tool blueprints bundled into a single item, referencing the `economy_tier_2` template for shared pricing rules.

#### Example 3: Scaffolding Custom Items from ItemsAdder or Nexo
```bash
/cb generate itemsadder:weapons --price-scale 2.0 --out custom/ia_weapons.yml
```
Scans ItemsAdder's internal item registry via zero-dependency reflection, preserves custom item model data (`custom_model_data`), registers the `ia:` item namespace, and writes schema-valid YAML blueprints.

```yaml
# yaml-language-server: $schema=../blueprint.schema.json
# Generated by CraftingBlueprints Auto-Scaffolder
singles:
  ia_ruby_sword:
    blueprint: "ia:ruby_sword"
    name: "<gradient:#FF0055:#FFAA00><bold>Ruby Sword Blueprint</bold></gradient>"
    permanent: true
    price: 3000.0
    sell_price: 750.0
    item:
      material: DIAMOND_SWORD
      custom_model_data: 10042
      glowing: false
```

> [!IMPORTANT]
> **Automatic Schema Header Injection**  
> Every file generated by `/cb generate` automatically includes the `# yaml-language-server: $schema=...` directive at line 1, providing immediate IntelliSense, auto-completion, and inline documentation in Visual Studio Code and IntelliJ IDEA.

---

## Related References

- [Player Command Guide](player-commands.md) — Comprehensive guide to player-facing commands.
- [LuckPerms Guide & OP Isolation](luckperms-permissions.md) — Production permission tiers and administrator nodes.
- [World Loot & Chest Injection](world-loot-tables.md) — Intercepting chest loot and trial chambers.
- [Diagnostics & Recipe Exports](diagnostics-and-exports.md) — Automated audit files and system reports in `exports/`.
