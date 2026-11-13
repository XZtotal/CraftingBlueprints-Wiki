# CraftingBlueprints Documentation

Welcome to the official documentation for **CraftingBlueprints**, an enterprise-grade Paper/Purpur plugin designed to transform recipe progression, economy balance, and custom crafting across modern Minecraft networks.

---

## What is CraftingBlueprints?

By default, Minecraft allows players to craft any unlocked recipe automatically. **CraftingBlueprints** introduces a true schematic progression system: players must discover, purchase, or earn physical or virtual **Blueprints** to craft specific weapons, armor, tools, or custom items.

Whether you operate a Survival SMP looking to gate Netherite gear, an MMORPG server with limited-use ancient forge scrolls, or a Skyblock network with tiered crafting licenses, CraftingBlueprints gives you absolute control over your server's crafting meta.

### Why Choose CraftingBlueprints?

* **Stunning In-Game Map Schematics**: Renders photorealistic technical blueprints directly onto standard 128x128 Minecraft maps (`Material.FILLED_MAP`) with 25 pre-calibrated background textures (magma, astral, slate, carbon weave), banknote-grade Guilloché borders, procedural item outlines, and rarity styling.
* **Selective Whitelist Mode**: Don't want to lock every single recipe? Restrict only specific items (such as Netherite equipment, potions, or Beacons) while leaving basic wood, stone, iron, and farming tools completely natural and free.
* **Minecraft 1.21 Crafter Protection**: Prevents redstone auto-crafters from bypassing your blueprint economy. Automated Crafter blocks that attempt to produce locked recipes are automatically intercepted and blocked cleanly.
* **Instant Multi-Server Synchronization**: Supports both standalone embedded SQLite and high-performance MySQL with real-time heartbeat sync signals for BungeeCord and Velocity networks.
* **Declarative YAML & Hot-Reloading**: Create hundreds of recipes cleanly using reusable templates (mixins), live file watching, and dry-run syntax validation (`/cb validate`).
* **Custom Items SPI Interoperability**: Seamless out-of-the-box integration with ItemsAdder, Oraxen, Nexo, MMOItems, EcoItems, MythicMobs, and CustomModelData.

---

## 10-Module Navigation

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } __[1. Installation & Setup](getting-started/installation.md)__

    ---

    System prerequisites, Paper/Purpur version matrix (1.18.2–1.21.x), Java requirements, and clean 4-step setup.

-   :material-lightning-bolt:{ .lg .middle } __[2. 3-Minute Quickstart](getting-started/quickstart.md)__

    ---

    Create, validate, grant, and craft your very first custom blueprint on a live server in 3 simple steps.

-   :material-cog:{ .lg .middle } __[3. Configuration Guide](configuration/config-guide.md)__

    ---

    Exhaustive, line-by-line breakdown of every key in `config.yml`: restrictions, stations, crafter, and file management.

-   :material-book-open-page-variant:{ .lg .middle } __[4. Blueprint Authoring](blueprints/basic-blueprint-yaml.md)__

    ---

    Complete YAML reference: property tables, templates, durability modes, groups, and custom item matching.

-   :material-shield-lock:{ .lg .middle } __[5. Gameplay Mechanics](mechanics/recipe-restrictions.md)__

    ---

    Selective Whitelist Mode, Shift-Click capacity math, 1.21 Crafter anti-exploit, and potion/smithing gating.

-   :material-view-grid:{ .lg .middle } __[6. In-Game Menus & GUIs](gui/player-menu.md)__

    ---

    Player dashboard (`/cb menu`), server catalog (`/cb item list`), return stack (`/cb return`), and live editor.

-   :material-console:{ .lg .middle } __[7. Commands & Permissions](commands-permissions/commands-reference.md)__

    ---

    Exhaustive reference for `/cb` commands, quantity safety bounds, and copy-paste LuckPerms configurations.

-   :material-database-sync:{ .lg .middle } __[8. Database & Networks](storage/mysql-multiserver.md)__

    ---

    Standalone SQLite setup and multi-server MySQL synchronization enforcing the Master/Worker Golden Rule.

-   :material-package-variant-closed:{ .lg .middle } __[9. Presets & Scaffolder](presets/using-presets.md)__

    ---

    1-Click Modality Presets (`/cb preset`) and automatic recipe scaffolding from Bukkit and plugins (`/cb generate`).

-   :material-school:{ .lg .middle } __[10. Cookbook & Tutorials](tutorials/tutorial-smp-netherite.md)__

    ---

    Step-by-step tutorials: SMP Netherite gating, 3-use magic scrolls, Vault shop setup, and crate distribution.

</div>

---

## Community & Issue Tracker

Need assistance, found an edge case, or have a feature proposal?

* Browse our [Frequently Asked Questions](faq/faq.md) and [Troubleshooting Guide](faq/troubleshooting.md).
* Submit an issue on the [Official GitHub Issue Tracker](https://github.com/XZtotal/CraftingBlueprints-Wiki/issues).
