# CraftingBlueprints Documentation

**CraftingBlueprints** is an enterprise-grade recipe restriction, progression gating, and physical schematic engine engineered for modern Paper and Purpur Minecraft servers (1.18.2 through 1.21.x and 26.x+). 

It bridges game balance, economy sinks, and immersive RPG progression by giving server administrators complete declarative control over what players can craft, smelt, brew, and forge across every in-game workstation.

---

## What is CraftingBlueprints?

In vanilla Minecraft, players instantly unlock and craft recipes as soon as materials touch their inventory. This bypasses server economies, collapses RPG progression tiers, and trivializes endgame gear acquisition.

CraftingBlueprints transforms crafting into an intentional, unlockable discipline:

* **Selective Restriction**: Keep wood, stone, iron, and farming tools 100% free while gating elite gear (Netherite weapons, Beacons, Mending enchantments, Strength II potions) behind physical blueprints or permission groups.
* **Physical & Virtual Blueprints**: Distribute blueprints as tradeable, physical in-game items (parchment scrolls, books, custom models) with finite craft uses or temporal durations, or grant them virtually via permission nodes.
* **Workstation Interception**: Enforces restrictions across 7 distinct crafting workstations—including the Minecraft 1.21 redstone-powered Crafter block, Brewing Stands, Furnaces, and Anvils—with complete anti-exploit and hopper injection protection.
* **Multi-Server Network Architecture**: Built from the ground up for high-traffic networks running Velocity or BungeeCord, offering instant MySQL synchronization and a database-backed zero-NFS cluster file distribution bus.

---

## Project Philosophy & Editions

A guiding principle of CraftingBlueprints is that **the plugin is designed to be 100% free for everyone**. All core gameplay mechanics—including recipe restrictions, all 7 workstation interceptions, automated Crafter blocking, multi-server MySQL synchronization, cluster file distribution, and full in-game map blueprint rendering with all built-in themes—**will always remain completely free and fully accessible in the base version**.

The **Extended Edition** exists exclusively for server administrators and community members who want to **support the ongoing development of the project**. As a token of gratitude for supporters, Extended unlocks deep cosmetic drafting enhancements (such as importing custom 128×128 PNG backgrounds, mathematical Guilloché security rosettes, custom stamp text, and Bayer 4×4 dithered typography gradients).

### Edition Comparison Matrix

| Capability / Feature | Base Edition (Free for Everyone) | Extended Edition (Supporter) |
| :--- | :---: | :---: |
| **Complete Recipe Restriction Engine** (Selective & Universal `.*`) | :white_check_mark: 100% Free | :white_check_mark: Included |
| **All 7 Workstation Interceptions** (Crafter, Anvil, Brewing, Smelting, etc.) | :white_check_mark: 100% Free | :white_check_mark: Included |
| **Physical Blueprint Items** (`PAPER`, `BOOK`, CustomModelData, PDC Tags) | :white_check_mark: 100% Free | :white_check_mark: Included |
| **Hierarchical Permission Groups & DAG Cycle Detection** | :white_check_mark: 100% Free | :white_check_mark: Included |
| **1-Click Modality Presets & Scaffolder** (`/cb preset`, `/cb generate`) | :white_check_mark: 100% Free | :white_check_mark: Included |
| **Multi-Server MySQL Synchronization & Cluster File Bus** | :white_check_mark: 100% Free | :white_check_mark: Included |
| **Custom Items SPI** (ItemsAdder, Nexo, Oraxen, MMOItems, EcoItems) | :white_check_mark: 100% Free | :white_check_mark: Included |
| **Vault Economy & PlaceholderAPI Integration** | :white_check_mark: 100% Free | :white_check_mark: Included |
| **In-Game Map Rendering** (`Material.FILLED_MAP` via `images-on-maps`) | :white_check_mark: 100% Free | :white_check_mark: Included |
| **Theme Presets Registry** (All built-in themes: Steel, Verdigris, Technical, Royal, etc.) | :white_check_mark: 100% Free (`map: theme`) | :white_check_mark: Included |
| **Granular Layer-by-Layer Customization** (Custom frames, stamps, contours) | :x: *(Preset themes only)* | :white_check_mark: Supporter Feature |
| **Custom 128x128 RGBA PNG Backgrounds** (`images/backgrounds/`) | :x: | :white_check_mark: Supporter Feature |
| **Banknote-Grade Guilloché Rosettes & Security Frames** | :x: | :white_check_mark: Supporter Feature |
| **Custom Status Stamps & Infinity Badges** ($\infty$, Plaque, Seal text overrides) | :x: *(Theme defaults only)* | :white_check_mark: Supporter Feature |
| **Bayer 4x4 Dithered Typography & Procedural Item Contours** | :x: | :white_check_mark: Supporter Feature |

!!! tip "Full Map Support Included in the Base Version"
    You do **not** need the Extended Edition to have beautiful in-game map blueprints! In the free base version, simply enable `images-on-maps: true` in your `config.yml` and apply any of the built-in themes (e.g. `map: steel` or `map: { theme: royal }`). Every core progression and aesthetic feature is fully unlocked and ready to use.

---

## Core Feature Highlights

### 1. Selective Restriction Engine
CraftingBlueprints is **permissive by default**. Standard recipes craft without interruption unless explicitly targeted in `restrictions.restricted-items`. Restrict exact items (`beacon`), wildcard patterns (`diamond_*`), regular expressions (`netherite_.*`), or specific workstation prefixes (`potion:strength.*`, `smelt:ancient_debris`).

### 2. 7 Intercepted Workstations
Unlike basic craft-cancellation plugins, CraftingBlueprints intercepts the entire crafting lifecycle across 7 production environments:

1. **Crafting Tables & 2x2 Grids**: Real-time recipe blocking and shift-craft capacity calculation.
2. **Minecraft 1.21 Crafter Blocks**: Redstone-triggered automated crafting interception with fail particles and sound feedback.
3. **Furnaces, Blast Furnaces, Smokers & Campfires**: Smelting restriction with persistent tile container owner tracking and hopper anti-exploit guards.
4. **Stonecutters**: Stone block slicing recipe restrictions.
5. **Anvils**: Differential enchantment and repair level validation.
6. **Enchanting Tables**: Enchantment tier restrictions.
7. **Brewing Stands**: Potion alchemy interception with persistent tile PDC bottle tracking and ingredient refunding.

### 3. Zero-NFS Cluster File Distribution Bus
For multi-server networks, CraftingBlueprints provides a database-backed file synchronization bus (`cb_cluster_files`). Deploy blueprints, modular configurations, or visual assets on your **Master Node**, and every **Worker Node** automatically mirrors changes over MySQL without configuring shared network storage or manual file copying.

### 4. Locked Output Previews & Vanilla Recipe Book Sync
Players immediately understand their progression boundaries:

* **Visual Overlays**: Displays red barrier overlays (`LOCKED_OVERLAY`) or custom lore hints in workstation output slots when an unlearned recipe is placed on the grid.
* **Recipe Book Synchronization**: Automatically removes restricted recipes from the vanilla Minecraft Recipe Book until unlocked, preventing player confusion.

### 5. 1-Click Modality Presets (`/cb preset`)
Eliminate the "blank-page problem." Deploy fully balanced, pre-configured progression suites for **Hardcore SMP**, **RPG Tiers**, **Skyblock Co-op**, or **OP Prison** in seconds with built-in economy scaling and zero modification to your global `config.yml`.

---

## Documentation Roadmap Navigator

Explore the comprehensive customer manual structured across the 7 Core Pillars:

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } __[1. Getting Started](getting-started/installation.md)__

    ---

    System prerequisites (Java 17+, Paper 1.18.2–1.21.x/26.x), 3-step installation, 1-Click presets (`/cb preset`), and authoring your first blueprint in 3 minutes.

-   :material-shield-lock:{ .lg .middle } __[2. Progression Gating & Rules](progression/recipe-restrictions.md)__

    ---

    Pattern-based recipe restrictions, category prefixes (`craft:`, `smelt:`, `potion:`), hierarchical permission groups with DAG cycle checks, OP isolation rules, and modular `configs/`.

-   :material-book-open-page-variant:{ .lg .middle } __3. Blueprint Authoring (Core)__

    ---

    Declarative YAML syntax (`singles:`, `packages:`, `mysteries:`), `default:` cascading, timed durations, craft use limits, reusable templates, and IDE schema validation (`blueprint.schema.json`).

-   :material-palette:{ .lg .middle } __4. Extended Edition (Map Drafting)__

    ---

    *Extended Edition exclusive*: photorealistic 128x128 map drafting, 25 procedural textures, Guilloché rosettes, wax seal status stamps, and dithered gradients.

-   :material-hammer-wrench:{ .lg .middle } __5. Workstations & Player Experience__

    ---

    Interception rules across 7 workstations, 1.21 Crafter automation, hopper anti-exploit guards, locked preview slots, personal progression menus (`/cb menu`), and `/cb return`.

-   :material-server-network:{ .lg .middle } __6. Storage & Network Clusters__

    ---

    Standalone SQLite with WAL mode, multi-server MySQL synchronization, Master vs. Worker node architecture, cluster file distribution bus (`/cb cluster`), and failover recovery runbooks.

-   :material-tune:{ .lg .middle } __7. Operations, Reference & Tutorials__

    ---

    Natural chest loot injection (`loot.yml`), comprehensive command & LuckPerms permission references, Vault economy, PlaceholderAPI identifiers, step-by-step tutorials, and diagnostic tools (`/cb status`, `/cb validate`).

</div>

---

## Operational Health & Quick Help

* **Run Diagnostics**: Type `/cb status` in your server console to review active engine adapters, database latency, and loaded blueprint counts.
* **Validate Configurations**: Run `/cb validate` at any time to verify YAML syntax, check for ID collisions, and preview lint warnings without altering the live server state.
* **Troubleshooting**: Visit our [Troubleshooting Guide](operations/troubleshooting-runbook.md) or submit an issue on the [Official GitHub Issue Tracker](https://github.com/XZtotal/CraftingBlueprints-Wiki/issues).
