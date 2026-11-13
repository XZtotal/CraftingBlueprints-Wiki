# CraftingBlueprints

Welcome to the official documentation wiki for **CraftingBlueprints**, an enterprise-grade Minecraft Paper/Purpur plugin designed to revolutionize custom crafting, progression, and blueprint gating across modern Minecraft versions.

---

## What is CraftingBlueprints?

**CraftingBlueprints** introduces a complete blueprint progression system to Minecraft. Instead of unlocking recipes automatically or allowing arbitrary item crafting, players discover, earn, or purchase physical or virtual **Blueprints** that grant the knowledge required to craft specific equipment, tools, and custom items.

### Key Highlights

* **Multi-Version Compatibility**: Native support across **Paper & Purpur 1.18.2 through 1.21.x** via automated internal NMS adapters.
* **Photorealistic Map Graphics**: Renders stunning technical blueprint schematics directly onto in-game Minecraft Maps, complete with 25+ aesthetic background textures (astral, magma, verdigris, carbon weave), mathematical guilloche frames, and rarity tiers.
* **Declarative YAML Engine**: Define unlimited blueprints with hot-reloading, template composition, group inheritance, and automated linting (`/cb validate`).
* **Vanilla & Crafter Interception**: Seamless integration with the vanilla crafting table, custom GUIs, shift-craft capacity calculation, and automated Minecraft 1.21 **Crafter block** ownership checks.
* **Whitelist & Recipe Gating**: Optional whitelist mode allows server owners to lock vanilla or modded recipes until the blueprint is unlocked.
* **Enterprise Storage & Network Sync**: Thread-safe asynchronous SQLite and MySQL backends with automated schema migrations and instant cross-server synchronization.
* **Developer API**: Rich event lifecycle (`BlueprintCraftEvent`, `BlueprintDiscoverEvent`) and full API access for external plugin developers.

---

## Quick Navigation

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } __[Installation & Requirements](getting-started/installation.md)__

    ---

    System requirements, setup instructions, and initial configuration guide.

-   :material-book-open-page-variant:{ .lg .middle } __[Blueprint Configuration](blueprints/configuration.md)__

    ---

    Learn how to write custom blueprints in YAML with custom materials, amounts, and metadata.

-   :material-palette:{ .lg .middle } __[Map Rendering & Visuals](blueprints/visuals.md)__

    ---

    Explore high-resolution map rendering, celestial/magma palettes, and guilloche frames.

-   :material-console:{ .lg .middle } __[Commands & Permissions](features/commands-permissions.md)__

    ---

    Exhaustive reference for all `/cb` administrative and player commands.

-   :material-database:{ .lg .middle } __[Storage & Multi-Server](features/storage.md)__

    ---

    Configure MySQL databases, BungeeCord/Velocity network sync, and automated backups.

-   :material-code-braces:{ .lg .middle } __[Developer API](developer/api.md)__

    ---

    Integrate CraftingBlueprints into your own plugins using `crafting-blueprints-api`.

</div>

---

## Community & Support

* **Found a bug?** Submit a report on our [GitHub Issue Tracker](https://github.com/XZtotal/CraftingBlueprints-Wiki/issues/new?template=bug_report.yml).
* **Have an idea?** Suggest improvements through our [Feature Request Form](https://github.com/XZtotal/CraftingBlueprints-Wiki/issues/new?template=feature_request.yml).
