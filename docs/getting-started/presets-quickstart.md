# Fast-Track Onboarding: 1-Click Presets (`/cb preset`)

The fastest way to evaluate, balance, and launch CraftingBlueprints on a production server is through **1-Click Modality Presets**. Instead of authoring dozens of YAML files by hand before your first playtest, presets allow you to deploy fully configured, production-tested progression suites in seconds.

---

## Solving the "Blank-Page Problem"

A common challenge for server administrators deploying progression gating plugins is the initial time investment: configuring 50 to 150 individual recipe restrictions, blueprint YAML files, permission groups, and economy prices before seeing the plugin in action.

CraftingBlueprints solves this through the `/cb preset` subsystem:
1. **Immediate Playability**: Deploy complete, thematic progression trees in a single command.
2. **Mathematically Balanced**: Every preset features pre-balanced economy pricing, crafting durability, and permission tiers designed for specific server gameplay styles.
3. **Safe Inactive Staging**: Presets stored in `presets/` remain completely inert until explicitly applied with `--confirm`.
4. **Zero `config.yml` Mutation**: Presets deploy modular files into `blueprints/presets/` and `configs/presets/`, leaving your core `config.yml` pristine and untouched.
5. **Instant Clean Removal**: You can uninstall any active preset at any time with `/cb preset remove <id>`, leaving zero residual data or orphan keys in memory.

> [!NOTE]
> **Master Node Requirement**  
> On multi-server networks with MySQL synchronization, preset deployment (`/cb preset apply`), uninstallation (`/cb preset remove`), and downloading (`/cb preset download`) must be executed on the designated **Master Node** (`is-master: true`). Worker nodes reject these commands to prevent database desynchronization.

---

## Built-In Modality Presets Catalog

CraftingBlueprints ships with 4 pre-compiled, production-ready modality packs accessible directly via `/cb preset list`:

| Preset ID | Modality Name | Templates | Blueprints Breakdown | Progression Architecture & Gameplay Style |
| :--- | :--- | :---: | :--- | :--- |
| `hardcore_smp` | **Hardcore SMP Survival** | `4` | **42 Total**<br>• 36 Singles<br>• 4 Packages<br>• 2 Mysteries | **Selective Equipment Gating**: Basic wood, stone, and leather are unrestricted. The `default` group unlocks basic iron gear; the `veteran` group unlocks utility tools. High-tier Diamond, Netherite, Mending, and combat potions require physical blueprints discoverable via dungeon chests or trading. |
| `rpg_tiers` | **RPG Progression Tiers** | `5` | **34 Total**<br>• 28 Singles<br>• 4 Packages<br>• 2 Mysteries | **Tiered Gear Progression (T1 to T5)**: Establishes a classic MMO progression curve from Apprentice to Mythic. Unlocks basic tools in `default`, intermediate armors in `warrior`, and restricts rare artifacts, enchanted weaponry, and master alchemical scrolls behind tiered blueprints. |
| `skyblock_coop` | **Skyblock Co-op & Automation** | `4` | **28 Total**<br>• 22 Singles<br>• 4 Packages<br>• 2 Mysteries | **Island Resource & Automation Gating**: Island basics, farming crops, and basic redstone are free. Progression restricts Diamond/Netherite tools, Beacons, Shulker Boxes, and automated redstone components behind team-unlocked blueprints. |
| `prison_ranks` | **OP Prison Ranks & Pickaxes** | `4` | **26 Total**<br>• 22 Singles<br>• 2 Packages<br>• 2 Mysteries | **Rank-Linked Mining Upgrades**: Designed for rank-up economies (`default` $\to$ `rank_b` $\to$ `rank_c` $\to$ `rank_prestigious`). Gates progressively higher efficiency pickaxes, Fortune tools, Beacons, and mining drill schematics behind in-game prestige milestones. |

---

## CLI Command Workflow

The `/cb preset` command suite requires the permission `craftingblueprints.admin.preset`:

### 1. Discover Available Presets (`/cb preset list`)
Inspect all built-in modality presets and local packages in your `presets/` folder:

```text
/cb preset list
```

The output displays preset identifiers, author tags, template counts, and blueprint breakdowns.

### 2. Preview Deployment with `--dry-run`
Before modifying any files, execute a dry-run to preview the impact of the preset:

```text
/cb preset apply hardcore_smp --dry-run
```

The dry-run simulates the installation and reports:
* Number of blueprint files and definitions created.
* Number of templates loaded.
* Groups and recipe restrictions scheduled for registration.
* Any ID collisions or file overwrites that would occur.
* **Guarantee**: `--dry-run` makes zero changes to your files or database.

### 3. Deploy Production Preset (`--confirm`)
When you are satisfied with the dry-run output, apply the preset with the `--confirm` flag:

```text
/cb preset apply hardcore_smp --confirm
```

The engine deploys blueprint definitions to `blueprints/presets/hardcore_smp/`, writes modular configurations to `configs/presets/hardcore_smp/`, reloads the runtime caches, and broadcasts synchronization signals across your network.

---

## Customizing Deployment with Modifier Flags

You can customize pricing, usage counts, and file naming during deployment using modifier flags:

| Flag | Parameter Format | Operational Behavior |
| :--- | :--- | :--- |
| `--dry-run` | *(None)* | Previews the deployment without writing files or modifying database state. |
| `--confirm` | *(None)* | Executes the deployment and commits files to disk and storage. |
| `--price-increase <±N%>` | `+25%`, `-15%` | Increases or decreases economy prices recursively across all blueprints in the preset. |
| `--price-scale <factor>` | `1.5`, `2.0`, `0.5` | Multiplies base economy prices by a numerical multiplier. Mutually exclusive with `--price-increase`. |
| `--sell-ratio <0..1>` | `0.25`, `0.50` | Sets `sell_price` as a fixed ratio of the purchase price (e.g. `0.25` = 25% of buy price). |
| `--uses-scale <factor>` | `2.0`, `0.5` | Scales finite craft uses on limited-use blueprints (e.g., doubling a 5-use scroll to 10 uses). |
| `--time-scale <factor>` | `2.0`, `0.5` | Scales temporal expiration durations (e.g., doubling a `24h` temporary blueprint to `48h`). |
| `--filter <regex>` | `diamond_.*`, `.*sword` | Selectively deploys only blueprints matching the regex while preserving required parent templates. |
| `--prefix <name>` | `smp_`, `season2_` | Prefixes all blueprint IDs, template references, and folder paths with `<name>` to prevent ID collisions. |
| `--skip-config` | *(None)* | Deploys blueprint item definitions while skipping modular `groups.yml` and `restrictions.yml` files. |
| `--force` | *(None)* | Overwrites target files if they already exist on disk. |

### Example: Scaled Deployment
To deploy `rpg_tiers` with 50% higher economy prices, double craft uses, and a custom folder prefix:

```text
/cb preset apply rpg_tiers --confirm --price-scale 1.5 --uses-scale 2.0 --prefix season1_
```

---

## The Zero `config.yml` Mutation Guarantee

A core design principle of CraftingBlueprints is **clean configuration isolation**:

```
plugins/CraftingBlueprints/
├── config.yml                         # 100% UNTOUCHED (Server global settings)
├── blueprints/
│   └── presets/
│       └── hardcore_smp/              # Deployed blueprint files
│           ├── templates.yml
│           ├── weapons.yml
│           └── armor.yml
└── configs/
    └── presets/
        └── hardcore_smp/              # Modular configuration files
            ├── groups.yml             # Modality permission groups
            └── restrictions.yml       # Modality restricted-items
```

When a preset is applied:
1. Blueprint files are written to `blueprints/presets/<id>/`.
2. Permission groups and recipe restrictions are written to `configs/presets/<id>/`.
3. The engine performs an in-memory **Set Union** ($A \cup B$) between `config.yml` and the modular files in `configs/presets/<id>/`.
4. **`config.yml` is never modified or rewritten.** Your existing comments, custom settings, and formatting remain 100% preserved.

---

## Clean Uninstallation (`/cb preset remove`)

If you want to remove an applied preset, CraftingBlueprints provides a complete, zero-leftover uninstallation command:

```text
/cb preset remove hardcore_smp
```

### Uninstallation Workflow:
1. **Target Identification**: Identifies all files associated with the preset in `blueprints/presets/<id>/`, `configs/presets/<id>/`, and `images/presets/<id>/`.
2. **Disk Cleanup**: Safely removes the corresponding preset subdirectories from disk.
3. **Database Purge**: Prunes the preset's blueprints from the central database and broadcasts a reload signal to Worker nodes.
4. **Memory Refresh**: Purges associated permission groups and restriction rules from memory, restoring server progression to its prior state with **zero leftover keys**.

---

## Next Steps

* **Author Custom Blueprints**: Learn the YAML schema to create custom blueprints from scratch in [Your First Blueprint](first-blueprint.md).
* **Configure Recipe Rules**: Deep-dive into pattern matching and station prefixes in [Recipe Restrictions](../progression/recipe-restrictions.md).
* **Set Up Permission Tiers**: Build multi-tier progression trees with [Hierarchical Permission Groups](../progression/permission-groups.md).
