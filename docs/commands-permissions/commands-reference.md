# Command Reference

All commands in CraftingBlueprints originate from the root `/cb` command (alias: `/craftingblueprints`).

---

## Player Commands

| Command | Arguments | Permission | Description |
| :--- | :--- | :--- | :--- |
| `/cb menu` | None | `craftingblueprints.menu` | Opens your personal blueprint progression dashboard. |
| `/cb item list` | None | `craftingblueprints.item.list` | Opens the paginated server blueprint catalog. |
| `/cb info` | `[id]` | `craftingblueprints.info` | Opens detailed recipe specifications and lore for a blueprint. |
| `/cb return` | None | `craftingblueprints.return` | Navigates back to the previously opened menu in the history stack. |

---

## Administration Commands

| Command | Arguments | Permission | Description |
| :--- | :--- | :--- | :--- |
| `/cb give` | `<player> <blueprint_id> [amount]` | `craftingblueprints.give` | Gives physical blueprint items to a player with overflow protection. |
| `/cb reload` | `[all\|blueprints\|config\|lang]` | `craftingblueprints.reload` | Hot-reloads configuration files, translations, or YAML blueprints. |
| `/cb validate` | None | `craftingblueprints.admin` | Performs a dry-run linting pass over all blueprint files in `blueprints/`. |
| `/cb status` | None | `craftingblueprints.status` | Displays system metrics, active NMS adapter, and database health. |
| `/cb item edit` | `<blueprint_id>` | `craftingblueprints.item.edit` | Opens the visual GUI editor for a blueprint. |
| `/cb preset` | `<list\|apply\|remove\|export\|download>` | `craftingblueprints.admin.preset` | Manages blueprint preset packages in `presets/`. |
| `/cb generate` | `<source> [flags]` | `craftingblueprints.admin.generate` | Scans registered recipes and auto-scaffolds blueprint YAML files. |

---

## Detailed Command Explanations

### `/cb give <player> <blueprint_id> [amount]`
Distributes physical blueprint items directly into a player's inventory:
* **Amount Bounds**: Strictly accepts numbers between `1` and `2304` (maximum player inventory capacity).
* **Inventory Overflow Protection**: If the player's inventory is full, remaining items are safely dropped directly at the player's feet into the world to prevent item loss.

### `/cb reload [module]`
Hot-reloads plugin subsystems instantly without lag or disconnects:
* `/cb reload all`: Full reload of config, blueprints, and language files.
* `/cb reload blueprints`: Re-reads and recompiles all files in `blueprints/`.
* `/cb reload config`: Reloads `config.yml`.
* `/cb reload lang`: Reloads `messages_en.yml` and `messages_es.yml`.

### `/cb validate`
Executes an offline dry-run verification:
* Validates that all Bukkit material names exist.
* Checks template references and detects circular dependencies.
* Reports exact line numbers and filenames for syntax errors.
