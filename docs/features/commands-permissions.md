# Commands & Permissions

CraftingBlueprints uses an intuitive subcommand system powered by a declarative Kotlin command framework. All commands originate from the root `/cb` command (alias `/craftingblueprints`).

---

## Command Reference

| Command | Arguments | Permission | Description |
| :--- | :--- | :--- | :--- |
| `/cb menu` | None | `craftingblueprints.menu` | Opens the main player blueprint GUI. |
| `/cb return` | None | `craftingblueprints.return` | Re-opens the previous menu in the navigation stack. |
| `/cb item list` | None | `craftingblueprints.item.list` | Opens the paginated blueprint catalog. |
| `/cb item edit` | `<id>` | `craftingblueprints.item.edit` | Opens the in-game GUI modifier for the specified blueprint. |
| `/cb info` | `[id]` | `craftingblueprints.info` | Opens detailed recipe requirements and lore for a blueprint. |
| `/cb give` | `<player> <blueprint_id> [amount]` | `craftingblueprints.give` | Gives physical blueprint items to a player with overflow protection. |
| `/cb reload` | `[all\|blueprints\|config\|lang]` | `craftingblueprints.reload` | Hot-reloads configuration files, translations, or blueprints. |
| `/cb validate` | None | `craftingblueprints.admin` | Performs a dry-run linting pass over all blueprint YAML files. |
| `/cb status` | None | `craftingblueprints.status` | Displays system health, active database engine, and blueprint metrics. |
| `/cb preset` | `<list\|apply\|remove\|export\|download>` | `craftingblueprints.admin.preset` | Manages blueprint preset packages in `presets/`. |
| `/cb generate` | `<source> [flags]` | `craftingblueprints.admin.generate` | Scans registered vanilla or plugin recipes and auto-scaffolds YAML blueprints. |
| `/cb testing` | `<run\|list\|status\|reset>` | `craftingblueprints.admin.testing` | In-game automated functional test runner suite. |

---

## Detailed Command Explanations

### `/cb give <player> <blueprint_id> [amount]`
Gives physical blueprint items directly to the targeted player.
* **Physical Preservation**: If the player's inventory is full, remaining items are safely dropped at the player's feet to prevent item deletion.
* **Quantity Limits**: Accepts amounts between `1` and `2304` (maximum player inventory capacity).

### `/cb reload [module]`
Hot-reloads plugin subsystems without interrupting players or causing server lag:
* `/cb reload all`: Full reload of configuration, blueprints, and language files.
* `/cb reload blueprints`: Re-reads and recompiles all YAML files in `blueprints/`.
* `/cb reload config`: Reloads `config.yml`.
* `/cb reload lang`: Reloads `messages_en.yml` and `messages_es.yml`.

### `/cb validate`
Executes an offline dry-run verification across all blueprint files:
* Checks for valid Bukkit material names.
* Validates recipe shapes and ingredients.
* Detects circular template dependencies.
* Reports exact file and line numbers for syntax errors.

---

## Permission Nodes

| Permission Node | Description | Default |
| :--- | :--- | :--- |
| `craftingblueprints.*` | Grants full access to all player and administrative commands. | `op` |
| `craftingblueprints.admin` | Access to core administration commands (`/cb validate`, etc.). | `op` |
| `craftingblueprints.admin.preset` | Access to preset deployment and management. | `op` |
| `craftingblueprints.admin.generate` | Access to automatic recipe scaffolding. | `op` |
| `craftingblueprints.admin.testing` | Access to the in-game automated test suite. | `op` |
| `craftingblueprints.give` | Permission to distribute blueprint items. | `op` |
| `craftingblueprints.reload` | Permission to reload configurations. | `op` |
| `craftingblueprints.status` | Permission to view performance diagnostics. | `op` |
| `craftingblueprints.menu` | Permission to open the personal blueprint GUI. | `true` (all players) |
| `craftingblueprints.return` | Permission to use stack-based GUI back navigation. | `true` (all players) |
| `craftingblueprints.item.list` | Permission to browse the public blueprint catalog. | `true` (all players) |
| `craftingblueprints.info` | Permission to view detailed blueprint specifications. | `true` (all players) |
| `craftingblueprints.bypass.ownership` | Bypasses item ownership restrictions. | `op` |
