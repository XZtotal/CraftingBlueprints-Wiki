# Troubleshooting & FAQ

This page addresses common issues, diagnostic tools, and frequently asked questions for **CraftingBlueprints**.

---

## Diagnostic Commands

Before reporting an issue, use the built-in diagnostic commands:

### 1. `/cb status`
Displays real-time performance and system metrics:
* Server engine and Paper version detected.
* Active multi-version adapter (`Adapter_v1_18_R2`, `Adapter_v1_20_R3`, `Adapter_v1_21_R1`).
* Database connection status (SQLite or HikariCP MySQL pool).
* Total registered blueprints in memory.

### 2. `/cb validate`
Lints all YAML files in `plugins/CraftingBlueprints/blueprints/`:
* Catches invalid material names.
* Warns about missing templates.
* Detects circular dependencies or malformed recipes.

---

## Frequently Asked Questions

### Why can players still craft items without a blueprint?
1. **Operator Bypass**: Check if the player is an OP. By default, `op-bypass: true` in `config.yml` allows operators to bypass all crafting restrictions.
2. **Restriction Mode**: Check `config.yml`. If `restrictions.mode: "restricted-only"`, only items matching `restricted-items` are locked. All other vanilla recipes are freely craftable.

### Why do maps appear blank?
* Ensure `images-on-maps: true` is enabled in `config.yml`.
* If using custom background PNGs, make sure they are exactly **128x128 pixels** in 32-bit RGBA PNG format and placed in `plugins/CraftingBlueprints/images/backgrounds/`.

### Can players steal GUI items?
* **No**. CraftingBlueprints features an anti-steal engine. All inventory slots are tagged with internal PersistentDataContainers (`MENU_TYPE`). Any attempt to click, drag, shift-click, or drop menu items is instantly cancelled and purged.

### Does it work on Minecraft 1.21 Crafters?
* **Yes**. On Paper 1.21+, automated redstone Crafter blocks are intercepted to prevent players from bypassing blueprint requirements using automation.

---

## Getting More Help

If you encounter an issue not covered here:

1. Enable verbose logging temporarily by setting `debug: true` in `config.yml` and running `/cb reload config`.
2. Inspect your server console logs.
3. Open a ticket with your logs on the [Official Bug Tracker](https://github.com/XZtotal/CraftingBlueprints-Wiki/issues/new?template=bug_report.yml).
