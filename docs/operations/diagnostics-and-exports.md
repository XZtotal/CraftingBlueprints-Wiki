# Diagnostics & Recipe Exports

CraftingBlueprints provides an enterprise-grade diagnostic and observability subsystem. Designed for network operators and server administrators, the plugin features live in-game health dashboards, non-destructive syntax linting, and automated asynchronous text auditing in `plugins/CraftingBlueprints/exports/`.

---

## In-Game Diagnostics Suite

Administrators can evaluate server health, database performance, and blueprint validity in real time using built-in diagnostic commands.

### 1. System Health Dashboard (`/cb status`)

The `/cb status` command generates a comprehensive diagnostic summary of the local node and network cluster.

```bash
/cb status
```

| Component / Metric | Status / Value | Operational Notes |
| :--- | :--- | :--- |
| **Server ID** | `e89f2a1b-4cd3-49fa-9871-38290f84ac12` | Unique node cluster instance |
| **Node Role** | `Master` (`is-master: true`) | Primary file watcher &amp; signal coordinator |
| **DB Engine** | `MySQL` (Ping: 3ms \| Pool: 2/10) | Low-latency cluster pool |
| **File Watcher** | `Enabled` (`blueprints/` \| 1500ms debounce) | Automatic hot-reload pipeline |
| **Cached Items** | `148 total` (142 file-managed, 6 manual) | Fast $\mathcal{O}(1)$ in-memory index |
| **In-Game Export** | `Active` (`exports/manual_blueprints.yml`) | Automated YAML synchronization |
| **Map Buffers** | `16 cached / 128 max` (256 KB JVM) | Flyweight palette LRU memory |
| **Network Nodes** | `3 active` (`Hub-01`, `Survival-01`, `Sky-01`)| Synchronized cluster workers |
| **Cluster Health** | `OK` | Zero split-brain master conflicts |

#### Key Diagnostic Metrics:

| Diagnostic Metric | Healthy Threshold | What It Indicates & Troubleshooting |
| :--- | :---: | :--- |
| **Node Role** | `Master` or `Worker` | Confirms whether this instance compiles local YAMLs (`Master`) or operates as a read-only node (`Worker`). |
| **Database Ping** | `< 15ms` | Round-trip query latency to your MySQL or SQLite database. Latency $> 50\text{ms}$ indicates network bottlenecks. |
| **Pool Connections**| `2/10` to `5/10` | Active HikariCP connections versus max pool ceiling. High values indicate saturated database worker threads. |
| **Cached Items** | Matches YAML count | Total blueprints registered in memory. Differentiates file-managed items from manual in-game items. |
| **Map Buffers** | `< Max Buffers` | Number of rendered map graphics buffers currently held in RAM cache. Keeps memory footprints negligible. |
| **Cluster Health** | `OK` | Warns if more than one server reports `is-master: true`, protecting against database overwrites. |

---

### 2. Dry-Run Schema Validator (`/cb validate`)

Before deploying changes or following a configuration reload, `/cb validate` scans all `.yml` files in `blueprints/` and `configs/` to detect syntax errors, unresolved items, and duplicate IDs.

```bash
/cb validate
```

#### Types of Issues Identified:

1. **Fatal YAML Syntax Errors**:
   Malformed indentation, unescaped characters, or illegal tabs. The validator pinpoints the exact file, line number, and column so you can fix it immediately without crashing your server.

2. **Version Incompatibility Warnings**:
   Identifies recipes or materials that do not exist in the current Minecraft version (e.g. attempting to load 1.21 `MACE` or `HEAVY_CORE` on a 1.20.4 Paper server).

3. **First-Win Collision Warnings**:
   Reports when two different files declare the identical blueprint ID (e.g. `kits/beginner.yml` vs `weapons/swords.yml`). Under the First-Win rule, the alphabetically earlier file takes priority.

4. **Visual Linting & Typo Suggestions**:
   Uses Levenshtein edit-distance algorithms to suggest corrections for misspelled frame styles, badge types, or background themes (e.g. suggesting `rosette` for `roseta`).

!!! note
    `/cb validate` runs strictly in-memory. It makes **zero modifications to your database** and does not alter loaded blueprints.

---

## Automated Diagnostic Exporters (`DiagnosticExporter`)

Managing dozens of recipe tiers, permission groups, and custom items can make it difficult to visualize the entire server progression. CraftingBlueprints includes the automated **`DiagnosticExporter`** engine that compiles human-readable text dumps directly into `plugins/CraftingBlueprints/exports/`.

### Zero TPS Impact (Asynchronous Execution)

Generating full text dumps of every server recipe, group hierarchy, and custom item inventory can involve thousands of string allocations. 

To preserve 20.0 TPS:

- All file operations are dispatched to asynchronous background threads (`runTaskAsynchronously`).
- The exporter uses high-throughput buffered UTF-8 writers (`OutputStreamWriter`).
- The Minecraft main thread and server tick loop are never blocked.

---

### Configuration & Triggering

The exporter is configured in `plugins/CraftingBlueprints/config.yml`:

```yaml
in-game-export:
  # Enable the diagnostic export subsystem
  enabled: true
  directory: "exports"

  # Automatically regenerate all 4 export files upon server boot and /cb reload
  auto-export-on-reload: true

  # Rolling backups for manual in-game blueprints
  backups:
    enabled: true
    interval: 1h
    max-count: 5
```

#### Manual Export Commands:
You can trigger an immediate asynchronous export at any time:

```bash
# Export all 4 diagnostic reports:
/cb export all
# Or via reload:
/cb reload exports

# Export individual reports:
/cb export recipes      # Generates minecraft_recipes.txt
/cb export groups       # Generates groups_recipes.txt
/cb export blueprints   # Generates registered_blueprints.txt
/cb export summary      # Generates system_summary.txt
```

---

## The 4 Generated Export Files

All reports are generated inside `plugins/CraftingBlueprints/exports/`:

```
plugins/CraftingBlueprints/exports/
├── minecraft_recipes.txt       # Complete catalogue of all Bukkit server recipes
├── groups_recipes.txt          # Full audit of groups, regex patterns & inheritance
├── registered_blueprints.txt   # Inventory of all custom blueprints and prices
└── system_summary.txt          # High-level technical report and coverage audit
```

### 1. `minecraft_recipes.txt`
Dumps every recipe registered in the Bukkit/Paper runtime, categorized into 11 distinct sections:

- **Shaped Recipes**: Grid matrix, ingredients, result amount, and namespaced keys.
- **Shapeless Recipes**: Ingredient lists and outputs.
- **Furnace / Smelting Recipes**: Smelting inputs, cooking times, and experience rewards.
- **Blasting, Smoking & Campfire Recipes**: Food and ore station recipes.
- **Stonecutting & Smithing Recipes**: Custom trim templates and stonecutter cuts.
- **Potion Brewing Types**: Every valid brewing target (`potion:strength`, `potion:invisibility`).
- **Vanilla Enchantments**: Every registered enchantment with its maximum level (`enchantment:mending`, `enchantment:sharpness`).

*Use Case*: Discovering exact recipe keys and namespaces when configuring selective recipe restrictions in `config.yml`.

---

### 2. `groups_recipes.txt`
Dumps the complete group progression tree, demonstrating exactly how parent groups pass down recipes to child groups through DAG inheritance.

#### Example Excerpt:
```text
================================================================================
                      GROUPS CONFIGURATION & RECIPES DUMP                       
================================================================================
Generated:       2026-11-20 18:30:00
Total Groups:    3
Permission Root: craftingblueprints.group.<id>
================================================================================

GROUP: vip
--------------------------------------------------------------------------------
Display Name:     "VIP"
Inherited Groups: default
Direct Patterns:  2
  - "iron_ingot"
  - "iron_.*"

Statistics:
  Direct Blueprints Matched:   15
  Inherited Blueprints Gained: 142
  Total Active Blueprints:     157

Unlocked Blueprints (157 total):
  - iron_sword [direct]
  - iron_pickaxe [direct]
  - oak_planks [inherited]
  - stick [inherited]
```

*Use Case*: Verifying that donor ranks or progression tiers correctly inherit base recipes from parent groups without unintended omissions.

---

### 3. `registered_blueprints.txt`
Provides a complete inventory of every blueprint item loaded by the plugin, whether declared in YAML files or created manually in-game:

- **Single Blueprints**: Target item, display title, source origin (`YAML File` vs `In-Game / DB`), rarity tier, economy buy/sell prices, and permission nodes.
- **Package Blueprints**: Bundle display title, source origin, and list of all contained blueprint IDs.
- **Mystery Blueprints**: Pool size, contained rewards, and roll probability weights.

*Use Case*: Auditing server shop economy balance, verifying blueprint IDs, and inspecting rarity distributions.

---

### 4. `system_summary.txt`
A comprehensive technical audit report designed for server administrators and technical support bundles.

#### Metrics Included:

- **Server Environment**: Java runtime version, operating system, server build version.
- **Database Configuration**: Engine type (MySQL/SQLite), connection status, pool statistics, and server UUID.
- **Restriction Engine Coverage**: Total restricted rules, total craftable vanilla materials, potion types, and enchantments.
- **Progression Coverage Audit**:
  $$\text{Coverage Percentage} = \frac{\text{Unique Recipes in Groups}}{\text{Total Server Recipes}} \times 100$$
  Displays what percentage of all server recipes are currently unlocked across configured groups.

- **JVM Memory & Cache Metrics**: Free memory, total memory, active blueprint count in RAM, and quantized map buffers.

---

## Technical Support & Auditing Best Practices

When opening a support request or reporting a bug on the official issue tracker:

1. Run `/cb export all` to refresh your reports.
2. Run `/cb status` and take a screenshot of your health dashboard.
3. Attach `exports/system_summary.txt` and `exports/groups_recipes.txt` to your support bundle.
4. These files contain **zero sensitive credentials** (database passwords and tokens are automatically redacted).

---

## Related References

- [Admin Operations & Scaffolding](admin-commands.md) — Administrative CLI commands and `/cb validate`.
- [LuckPerms Guide & OP Isolation](luckperms-permissions.md) — Permission nodes and group assignment.
- [Hierarchical Permission Groups](../progression/permission-groups.md) — Defining DAG group inheritance.
- [Modular Configurations](../progression/modular-configs.md) — Modular config merging in `configs/`.
