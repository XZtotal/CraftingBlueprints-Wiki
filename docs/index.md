# CraftingBlueprints Documentation

Welcome to the official documentation for **CraftingBlueprints**, an enterprise-grade Paper/Purpur plugin designed to transform recipe progression, economy balance, and custom crafting across modern Minecraft servers.

---

## What is CraftingBlueprints?

By default, Minecraft allows players to craft any unlocked recipe automatically. **CraftingBlueprints** introduces a true schematic progression system: players must discover, purchase, or earn physical or virtual **Blueprints** to craft specific weapons, armor, tools, or custom items.

Whether you run a Survival SMP looking to gate Netherite gear, an MMORPG server with limited-use ancient scrolls, or a Skyblock network with tiered crafting licenses, CraftingBlueprints gives you absolute control over your server's crafting meta.

### Why Choose CraftingBlueprints?

* **Stunning In-Game Map Schematics**: Renders photorealistic technical blueprints directly onto standard 128x128 Minecraft maps with 20+ procedural backgrounds (magma, astral, slate, carbon weave), banknote-style Guilloche borders, and rarity tiers.
* **Selective Whitelist Mode**: Don't want to lock every single recipe? Restrict only specific items (such as Netherite gear or Beacons) while leaving basic wood, stone, and iron tools completely open.
* **Minecraft 1.21 Crafter Protection**: Prevents redstone auto-crafters from bypassing your blueprint economy. Automated crafters that attempt to craft locked recipes are automatically intercepted.
* **Instant Multi-Server Synchronization**: Supports both standalone SQLite and high-performance MySQL with automatic schema migrations for BungeeCord and Velocity networks.
* **Declarative YAML & Hot-Reloading**: Create hundreds of recipes cleanly using reusable templates (mixins), live file watching, and dry-run syntax validation (`/cb validate`).

---

## Quick Navigation

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } __[Installation & Setup](getting-started/installation.md)__

    ---

    System requirements, Paper/Purpur compatibility, and clean installation instructions.

-   :material-lightning-bolt:{ .lg .middle } __[3-Minute Quickstart](getting-started/quickstart.md)__

    ---

    Create, grant, and craft your very first blueprint in three simple steps.

-   :material-book-open-page-variant:{ .lg .middle } __[Blueprint Authoring](blueprints/basic-blueprint-yaml.md)__

    ---

    Learn how to write custom blueprints in YAML with custom prices, lore, and items.

-   :material-shield-lock:{ .lg .middle } __[Recipe Restrictions](mechanics/recipe-restrictions.md)__

    ---

    Configure Whitelist Mode to restrict only end-game gear while keeping basic crafts free.

-   :material-palette:{ .lg .middle } __[Map Visuals & Graphics](blueprints/map-visuals.md)__

    ---

    Explore 20+ procedural map backgrounds, Guilloche security borders, and rarity styling.

-   :material-console:{ .lg .middle } __[Commands & Permissions](commands-permissions/commands-reference.md)__

    ---

    Exhaustive reference for `/cb` commands and ready-to-copy LuckPerms group permissions.

-   :material-database-sync:{ .lg .middle } __[Multi-Server MySQL](storage/mysql-multiserver.md)__

    ---

    Connect multiple proxy servers to a shared database with zero race conditions.

-   :material-school:{ .lg .middle } __[Cookbook & Tutorials](tutorials/tutorial-smp-netherite.md)__

    ---

    Step-by-step guides for SMP Netherite gating, 3-use RPG scrolls, and Vault shops.

</div>

---

## Community & Issue Tracker

Need help, found an unexpected edge-case, or have a feature proposal?
* Browse our [Frequently Asked Questions](faq/faq.md).
* Submit an issue on the [Official GitHub Issue Tracker](https://github.com/XZtotal/CraftingBlueprints-Wiki/issues).
